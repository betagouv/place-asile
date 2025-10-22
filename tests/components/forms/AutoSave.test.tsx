import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { AutoSave } from "@/app/components/forms/AutoSave";

import {
  FormTestWrapper,
  resetAllMocks,
  waitForAutoSave,
} from "../../test-utils/form-test-wrapper";

// NOTE: AutoSave is better tested through integration tests where it's used in actual forms.
// The debounce + watch() interaction is complex to mock properly in isolation.
describe("AutoSave", () => {
  const mockOnSave = vi.fn();

  const testSchema = z.object({
    name: z.string().min(1),
    email: z.string().email().optional(),
    age: z.number().min(0).optional(),
  });

  beforeEach(() => {
    resetAllMocks();
    mockOnSave.mockClear();
  });

  describe("Rendering", () => {
    it("should render without visual output", () => {
      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            name: "Test",
            email: "test@example.com",
          }}
        >
          <AutoSave schema={testSchema} onSave={mockOnSave} />
        </FormTestWrapper>
      );

      // Should not have any DOM output
      expect(container.firstChild).toBeNull();
    });

    it("should return null", () => {
      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            name: "Test",
          }}
        >
          <AutoSave schema={testSchema} onSave={mockOnSave} />
        </FormTestWrapper>
      );

      expect(container.textContent).toBe("");
    });
  });

  describe("Validation", () => {
    it("should not call onSave if validation fails", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});

      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            name: "", // Invalid: required
          }}
        >
          <AutoSave schema={testSchema} onSave={mockOnSave} />
          <input name="name" />
        </FormTestWrapper>
      );

      const input = container.querySelector('input[name="name"]')!;
      await userEvent.clear(input);

      await waitForAutoSave();

      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });
});
