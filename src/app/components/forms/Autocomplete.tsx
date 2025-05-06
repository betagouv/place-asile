"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { cn } from "@/app/utils/classname.util";
import {
  AutocompleteSuggestion,
  AutocompleteHandle,
} from "@/app/hooks/useAutocomplete";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useImperativeHandle(ref, () => ({
    resetSuggestions: () => {},
    setShowSuggestions: () => {},
  }));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (onSelect) {
          onSelect(null);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onSelect]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "Tab") {
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      if (onSelect) {
        onSelect(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (onSelect) {
        onSelect(null);
      }
    }
  };

  if (!showSuggestions || suggestions.length === 0) {
    return null;
  }

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

type AutocompleteProps<T extends AutocompleteSuggestion> = {
  suggestions: T[];
  isLoading: boolean;
  showSuggestions: boolean;
  className?: string;
  listClassName?: string;
  renderSuggestion?: (suggestion: T) => React.ReactNode;
  onSelect?: (suggestion: T | null) => void;
};
