import { renderHook } from "@testing-library/react";
import { useYearDate } from "@/app/hooks/useYearDate";
import { describe, it, expect, vi } from "vitest";

describe("useYearDate", () => {
  const originalToLocaleDateString = Date.prototype.toLocaleDateString;

  beforeEach(() => {
    Date.prototype.toLocaleDateString = vi
      .fn()
      .mockImplementation(function (this: Date) {
        const year = this.getFullYear();
        const month = String(this.getMonth() + 1).padStart(2, "0");
        const day = String(this.getDate()).padStart(2, "0");
        return `${day}/${month}/${year}`;
      });
  });

  afterEach(() => {
    Date.prototype.toLocaleDateString = originalToLocaleDateString;
    vi.clearAllMocks();
  });

  it("should convert a year string to a date string for January 1st of that year", () => {
    // GIVEN
    const year = "2025";

    // WHEN
    const { result } = renderHook(() => useYearDate(year));

    // THEN
    expect(result.current).toBe("01/01/2025");
  });

  it("should handle past years correctly", () => {
    // GIVEN
    const year = "2000";

    // WHEN
    const { result } = renderHook(() => useYearDate(year));

    // THEN
    expect(result.current).toBe("01/01/2000");
  });

  it("should handle future years correctly", () => {
    // GIVEN
    const year = "2050";

    // WHEN
    const { result } = renderHook(() => useYearDate(year));

    // THEN
    expect(result.current).toBe("01/01/2050");
  });

  it("should handle invalid input by returning a date based on the parsed number", () => {
    // GIVEN
    const invalidYear = "invalid";

    // WHEN
    const { result } = renderHook(() => useYearDate(invalidYear));

    // THEN
    expect(result.current).toBe("01/01/0");
  });
});
