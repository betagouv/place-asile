"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { cn } from "@/app/utils/classname.util";

// Autocomplete component with forwardRef to expose imperative handle
export const Autocomplete = forwardRef(function Autocomplete<
  T extends AutocompleteSuggestion
>(
  {
    suggestions,
    isLoading,
    showSuggestions,
    className = "",
    listClassName = "",
    renderSuggestion,
    onSelect,
  }: AutocompleteProps<T>,
  ref: React.Ref<AutocompleteHandle>
) {
  // Set up click outside handler
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    resetSuggestions: () => {
      // This function intentionally left empty as it's just a trigger
      // The actual state is managed in the parent component
    },
    setShowSuggestions: (/* show: boolean */) => {
      // This function is called by the parent to control visibility
      // The actual state is managed in the parent component
      // Parameter intentionally commented out to avoid lint warning
    },
  }));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // Handle click outside
        if (onSelect) {
          // We'll use the onSelect callback to notify the parent
          // This is a signal to the parent that the user clicked outside
          // and the suggestions should be hidden
          onSelect(null);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onSelect]);

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    // Tab key - let the default behavior happen but close on blur
    if (e.key === "Tab") {
      // Don't prevent default to allow normal tab navigation
      // The onBlur handler will take care of closing the suggestions
      return;
    }

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    }
    // Enter key
    else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      if (onSelect) {
        onSelect(suggestions[activeIndex]);
      }
    }
    // Escape key
    else if (e.key === "Escape") {
      e.preventDefault();
      if (onSelect) {
        onSelect(null);
      }
    }
  };

  if (!showSuggestions || suggestions.length === 0) {
    return null;
  }

  // Client-side handler for suggestion selection
  const handleSelectSuggestion = (suggestion: T) => {
    if (onSelect) {
      onSelect(suggestion);
    }
  };

  return (
    <div
      className={cn(className)}
      ref={containerRef}
      onKeyDown={handleKeyDown}
      onBlur={(e) => {
        // Check if the new focus target is outside our component
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          if (onSelect) {
            onSelect(null);
          }
        }
      }}
      tabIndex={-1}
    >
      <ul
        id="autocomplete-suggestions"
        role="listbox"
        aria-label="Suggestions"
        className={cn(
          "absolute bottom-0 translate-y-full shadow-md w-full bg-white border border-gray-300 z-10 overflow-y-auto m-0 p-2 list-none",
          listClassName
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {suggestions.map((suggestion, index) => (
          <li
            id={`suggestion-${index}`}
            key={suggestion.id || index}
            role="option"
            aria-selected={activeIndex === index}
            className={cn(
              "px-3 py-2 cursor-pointer",
              activeIndex === index ? "bg-gray-100" : "hover:bg-gray-100",
              index < suggestions.length - 1 ? "border-b border-gray-200" : ""
            )}
            onClick={() => handleSelectSuggestion(suggestion)}
            onMouseEnter={() => setActiveIndex(index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelectSuggestion(suggestion);
              }
            }}
            tabIndex={0}
          >
            {renderSuggestion ? renderSuggestion(suggestion) : suggestion.label}
          </li>
        ))}
      </ul>

      {isLoading && (
        <div className="text-center py-2" aria-live="polite" role="status">
          Chargement...
        </div>
      )}
    </div>
  );
});

// Hook for handling autocomplete functionality
export function useAutocomplete<T extends AutocompleteSuggestion>(
  fetchSuggestions: (query: string) => Promise<T[]>,
  debounceMs: number = 300
) {
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autocompleteRef = useRef<AutocompleteHandle>(null);

  const handleInputChange = useCallback(
    async (value: string) => {
      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer for debounce
      debounceTimerRef.current = setTimeout(async () => {
        if (!value || value.length < 3) {
          setSuggestions([]);
          setShowSuggestions(false);
          return;
        }

        setIsLoading(true);
        try {
          const results = await fetchSuggestions(value);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setIsLoading(false);
        }
      }, debounceMs);
    },
    [fetchSuggestions, debounceMs]
  );

  const resetSuggestions = useCallback(() => {
    setSuggestions([]);
    setShowSuggestions(false);
    if (autocompleteRef.current) {
      autocompleteRef.current.resetSuggestions();
    }
  }, []);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    suggestions,
    isLoading,
    showSuggestions,
    setShowSuggestions,
    handleInputChange,
    resetSuggestions,
    autocompleteRef,
  };
}

export type AutocompleteSuggestion = {
  id?: string;
  label: string;
  key: string;
};

type AutocompleteProps<T extends AutocompleteSuggestion> = {
  suggestions: T[];
  isLoading: boolean;
  showSuggestions: boolean;
  className?: string;
  listClassName?: string;
  renderSuggestion?: (suggestion: T) => React.ReactNode;
  onSelect?: (suggestion: T | null) => void;
};

export type AutocompleteHandle = {
  resetSuggestions: () => void;
  setShowSuggestions: (show: boolean) => void;
};
