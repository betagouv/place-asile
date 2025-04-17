import { renderHook } from "@testing-library/react";
import { useFieldValidator } from "@/app/hooks/useFieldValidator";
import { z } from "zod";
import { describe, it, expect, vi } from "vitest";

describe("useFieldValidator", () => {
  // Create a test schema
  const testSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    age: z.number().min(18, "Must be at least 18 years old"),
  });

  it("should return undefined for valid field values", () => {
    // GIVEN
    const { result } = renderHook(() => useFieldValidator(testSchema));

    // WHEN - Test valid name
    const nameErrors = result.current.validateField("name", "John");

    // THEN
    expect(nameErrors).toBeUndefined();

    // WHEN - Test valid email
    const emailErrors = result.current.validateField(
      "email",
      "john@example.com"
    );

    // THEN
    expect(emailErrors).toBeUndefined();

    // WHEN - Test valid age
    const ageErrors = result.current.validateField("age", 25);

    // THEN
    expect(ageErrors).toBeUndefined();
  });

  it("should return error messages for invalid field values", () => {
    // GIVEN
    const { result } = renderHook(() => useFieldValidator(testSchema));

    // WHEN - Test invalid name (too short)
    const nameErrors = result.current.validateField("name", "J");

    // THEN
    expect(nameErrors).toEqual(["Name must be at least 2 characters"]);

    // WHEN - Test invalid email
    const emailErrors = result.current.validateField("email", "not-an-email");

    // THEN
    expect(emailErrors).toEqual(["Invalid email format"]);

    // WHEN - Test invalid age
    const ageErrors = result.current.validateField("age", 16);

    // THEN
    expect(ageErrors).toEqual(["Must be at least 18 years old"]);
  });

  it("should handle undefined values", () => {
    // GIVEN
    const { result } = renderHook(() => useFieldValidator(testSchema));

    // WHEN - Test undefined name
    const nameErrors = result.current.validateField("name", undefined);

    // THEN - Should return error as the schema requires a string
    expect(nameErrors).toBeDefined();

    // WHEN - Test undefined email
    const emailErrors = result.current.validateField("email", undefined);

    // THEN - Should return error as the schema requires a string
    expect(emailErrors).toBeDefined();
  });

  it("should handle non-existent fields", () => {
    // GIVEN
    const originalConsoleError = console.error;
    console.error = vi.fn();

    const { result } = renderHook(() => useFieldValidator(testSchema));

    // WHEN - Test non-existent field
    const errors = result.current.validateField(
      "nonExistentField",
      "some value"
    );

    // THEN
    expect(errors).toBeUndefined();
    expect(console.error).toHaveBeenCalled();

    // Restore console.error
    console.error = originalConsoleError;
  });

  it("should validate different types correctly", () => {
    // GIVEN
    const { result } = renderHook(() => useFieldValidator(testSchema));

    // WHEN - Test string field with number (type mismatch)
    const nameErrors = result.current.validateField("name", 123);

    // THEN
    expect(nameErrors).toBeDefined();

    // WHEN - Test number field with string (type mismatch)
    const ageErrors = result.current.validateField("age", "twenty");

    // THEN
    expect(ageErrors).toBeDefined();
  });

  it("should handle complex validation scenarios", () => {
    // GIVEN
    const complexSchema = z.object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    });

    const { result } = renderHook(() => useFieldValidator(complexSchema));

    // WHEN - Test valid password
    const validPasswordErrors = result.current.validateField(
      "password",
      "Password123"
    );

    // THEN
    expect(validPasswordErrors).toBeUndefined();

    // WHEN - Test password that's too short
    const shortPasswordErrors = result.current.validateField(
      "password",
      "Pass1"
    );

    // THEN
    expect(shortPasswordErrors).toEqual([
      "Password must be at least 8 characters",
    ]);

    // WHEN - Test password without uppercase
    const noUppercaseErrors = result.current.validateField(
      "password",
      "password123"
    );

    // THEN
    expect(noUppercaseErrors).toEqual([
      "Password must contain at least one uppercase letter",
    ]);

    // WHEN - Test password without number
    const noNumberErrors = result.current.validateField(
      "password",
      "PasswordABC"
    );

    // THEN
    expect(noNumberErrors).toEqual([
      "Password must contain at least one number",
    ]);
  });
});
