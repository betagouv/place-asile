"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type AutocompleteSuggestion = {
  id?: string;
  label: string;
  key: string;
};

export type AutocompleteHandle = {
  resetSuggestions: () => void;
  setShowSuggestions: (show: boolean) => void;
};
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
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
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
