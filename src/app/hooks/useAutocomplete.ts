"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function useAutocomplete<T extends AutocompleteSuggestion>(
  fetchSuggestions: (query: string) => Promise<T[]>,
  debounceMs: number = 300
) {
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = useCallback(
    async (value: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(async () => {
        if (!value || value.length < 3) {
          setSuggestions([]);
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
  };
}

export type AutocompleteSuggestion = {
  id?: string;
  label: string;
  key: string;
};
