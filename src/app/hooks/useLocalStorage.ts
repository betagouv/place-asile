import { useState } from "react";

export type UseLocalStorageReturn<T> = {
  currentValue: T | undefined;
  updateLocalStorageValue: (value: T) => void;
  resetLocalStorageValues: () => void;
};

export function useLocalStorage<T>(
  key: string | null,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [currentValue, setCurrentValue] = useState<T | undefined>(() => {
    if (!key || typeof localStorage === "undefined") {
      return undefined;
    }
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error getting localStorage:", error);
      return initialValue;
    }
  });

  const updateLocalStorageValue = (value: T) => {
    if (!key || typeof localStorage === "undefined") {
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setCurrentValue(value);
    } catch (error) {
      console.error("Error setting localStorage:", error);
    }
  };

  const resetLocalStorageValues = () => {
    if (!key || typeof localStorage === "undefined") {
      return;
    }
    try {
      localStorage.removeItem(key);
      setCurrentValue(initialValue);
    } catch (error) {
      console.error("Error resetting localStorage:", error);
    }
  };

  return {
    currentValue,
    updateLocalStorageValue,
    resetLocalStorageValues,
  };
}
