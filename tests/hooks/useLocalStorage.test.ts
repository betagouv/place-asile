import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { describe, it, expect, beforeEach, vi, afterAll } from "vitest";

// Sauvegarder la référence originale de localStorage
const originalLocalStorage = window.localStorage;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

// Utiliser vi.mock pour remplacer localStorage
vi.stubGlobal("localStorage", localStorageMock);

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  // Restaurer la valeur originale après tous les tests
  afterAll(() => {
    vi.stubGlobal("localStorage", originalLocalStorage);
  });

  it("should use the initial value when localStorage is empty", () => {
    // GIVEN
    const key = "testKey";
    const initialValue = { name: "John", age: 30 };

    // WHEN
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    // THEN
    expect(result.current.currentValue).toEqual(initialValue);
    expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
  });

  it("should retrieve value from localStorage if it exists", () => {
    // GIVEN
    const key = "testKey";
    const storedValue = { name: "Jane", age: 25 };
    const initialValue = { name: "John", age: 30 };

    // Setup localStorage with a value
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(storedValue));

    // WHEN
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    // THEN
    expect(result.current.currentValue).toEqual(storedValue);
    expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
  });

  it("should update localStorage when value changes", () => {
    // GIVEN
    const key = "testKey";
    const initialValue = { name: "John", age: 30 };
    const newValue = { name: "Jane", age: 25 };

    // WHEN
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    act(() => {
      result.current.updateLocalStorageValue(newValue);
    });

    // THEN
    expect(result.current.currentValue).toEqual(newValue);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify(newValue)
    );
  });

  it("should handle localStorage errors when getting data", () => {
    // GIVEN
    const key = "testKey";
    const initialValue = { name: "John", age: 30 };

    // Mock console.error
    const originalConsoleError = console.error;
    console.error = vi.fn();

    // Force an error when getting from localStorage
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error("getItem error");
    });

    // WHEN
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    // THEN
    expect(result.current.currentValue).toEqual(initialValue);
    expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
    expect(console.error).toHaveBeenCalled();

    // Restore console.error
    console.error = originalConsoleError;
  });

  it("should handle localStorage errors when setting data", () => {
    // GIVEN
    const key = "testKey";
    const initialValue = { name: "John", age: 30 };
    const newValue = { name: "Jane", age: 25 };

    // Mock console.error
    const originalConsoleError = console.error;
    console.error = vi.fn();

    // Force an error when setting to localStorage
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error("setItem error");
    });

    // WHEN
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    // Update the value
    act(() => {
      result.current.updateLocalStorageValue(newValue);
    });

    // THEN
    expect(console.error).toHaveBeenCalled();

    // Restore console.error
    console.error = originalConsoleError;
  });

  it("should handle null key properly", () => {
    // GIVEN
    const key = null;
    const initialValue = { name: "John", age: 30 };
    const newValue = { name: "Jane", age: 25 };

    // WHEN
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    // THEN - Initial state should be undefined
    expect(result.current.currentValue).toBeUndefined();
    expect(localStorageMock.getItem).not.toHaveBeenCalled();

    // Update the value - should not affect localStorage
    act(() => {
      result.current.updateLocalStorageValue(newValue);
    });

    expect(result.current.currentValue).toBeUndefined();
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });
});
