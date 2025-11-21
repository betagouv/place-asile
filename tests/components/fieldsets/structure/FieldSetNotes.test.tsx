import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { FieldSetNotes } from "@/app/components/forms/fieldsets/structure/FieldSetNotes";

import {
  FormTestWrapper,
  resetAllMocks,
} from "../../../test-utils/form-test-wrapper";

describe("FieldSetNotes", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Rendering", () => {
    it("should render textarea for notes", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            notes: "",
          }}
        >
          <FieldSetNotes />
        </FormTestWrapper>
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute("id", "notes");
    });

    it("should render helper text example", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            notes: "",
          }}
        >
          <FieldSetNotes />
        </FormTestWrapper>
      );

      expect(
        screen.getByText(/17\/05\/2025 Jean-Michel DUPONT/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/dialogue de gestion/i)).toBeInTheDocument();
    });

    it("should have 8 rows for textarea", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            notes: "",
          }}
        >
          <FieldSetNotes />
        </FormTestWrapper>
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("rows", "8");
    });
  });

  describe("Text input", () => {
    it("should accept text input", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            notes: "",
          }}
        >
          <FieldSetNotes />
        </FormTestWrapper>
      );

      const textarea = screen.getByRole("textbox");
      const testText = "This is a test note";
      await user.type(textarea, testText);

      await waitFor(() => {
        expect(textarea).toHaveValue(testText);
      });
    });

    it("should handle multiple notes accumulated over time", async () => {
      const historicalNotes =
        "10/12/2024 - Visite sur site effectuée\n" +
        "15/12/2024 - Réception des documents\n" +
        "20/12/2024 - Validation du budget\n" +
        "05/01/2025 - Suivi téléphonique";

      render(
        <FormTestWrapper
          defaultValues={{
            notes: historicalNotes,
          }}
        >
          <FieldSetNotes />
        </FormTestWrapper>
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue(historicalNotes);
    });
  });

  describe("Form field attributes", () => {
    it("should have correct name attribute", () => {
      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            notes: "",
          }}
        >
          <FieldSetNotes />
        </FormTestWrapper>
      );

      const textarea = container.querySelector('textarea[id="notes"]');
      expect(textarea).toBeInTheDocument();
    });
  });
});
