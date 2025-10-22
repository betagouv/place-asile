import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach,describe, expect, it } from "vitest";

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

    it("should handle multiline text", async () => {
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
      const multilineText = "Line 1\nLine 2\nLine 3";
      await user.type(textarea, "Line 1{Enter}Line 2{Enter}Line 3");

      await waitFor(() => {
        expect(textarea).toHaveValue(multilineText);
      });
    });

    it("should handle long text", async () => {
      const user = userEvent.setup();

      const longText =
        "This is a very long note that contains a lot of information. " +
        "It should be able to handle multiple sentences and paragraphs. " +
        "The textarea should expand to accommodate all the text that the user types. " +
        "This is useful for agents who need to add detailed notes about structures.";

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
      await user.type(textarea, longText);

      await waitFor(() => {
        expect(textarea).toHaveValue(longText);
      });
    });

    it("should update value when user types", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            notes: "Initial text",
          }}
        >
          <FieldSetNotes />
        </FormTestWrapper>
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("Initial text");

      await user.clear(textarea);
      await user.type(textarea, "Updated text");

      await waitFor(() => {
        expect(textarea).toHaveValue("Updated text");
      });
    });
  });

  describe("Special characters", () => {
    it("should handle special characters", async () => {
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
      const textWithSpecialChars = "Test: é, à, ç, €, @, #, %, &";
      await user.type(textarea, textWithSpecialChars);

      await waitFor(() => {
        expect(textarea).toHaveValue(textWithSpecialChars);
      });
    });

    it("should handle dates and slashes", async () => {
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
      const textWithDates = "Meeting on 15/03/2024 at 14:00";
      await user.type(textarea, textWithDates);

      await waitFor(() => {
        expect(textarea).toHaveValue(textWithDates);
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle empty initial value", () => {
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
      expect(textarea).toHaveValue("");
    });

    it("should handle null initial value", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            notes: null,
          }}
        >
          <FieldSetNotes />
        </FormTestWrapper>
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("");
    });

    it("should handle undefined initial value", () => {
      render(
        <FormTestWrapper defaultValues={{}}>
          <FieldSetNotes />
        </FormTestWrapper>
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("");
    });

    it("should preserve existing notes", () => {
      const existingNotes = "Existing important notes about the structure";

      render(
        <FormTestWrapper
          defaultValues={{
            notes: existingNotes,
          }}
        >
          <FieldSetNotes />
        </FormTestWrapper>
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue(existingNotes);
    });

    it("should allow clearing the textarea", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            notes: "Some text to clear",
          }}
        >
          <FieldSetNotes />
        </FormTestWrapper>
      );

      const textarea = screen.getByRole("textbox");
      await user.clear(textarea);

      await waitFor(() => {
        expect(textarea).toHaveValue("");
      });
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

    it("should have fr-input class", () => {
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
      expect(textarea).toHaveClass("fr-input");
    });
  });

  describe("Copy and paste", () => {
    it("should handle pasted text", async () => {
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
      const pastedText = "This text was pasted from clipboard";

      // Simulate paste action
      await user.click(textarea);
      await user.paste(pastedText);

      await waitFor(() => {
        expect(textarea).toHaveValue(pastedText);
      });
    });

    it("should handle formatted text paste (strips formatting)", async () => {
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
      // Even if pasted from formatted source, textarea will only get plain text
      const plainText = "Plain text from formatted source";

      await user.click(textarea);
      await user.paste(plainText);

      await waitFor(() => {
        expect(textarea).toHaveValue(plainText);
      });
    });
  });

  describe("Real-world use cases", () => {
    it("should handle typical agent note format", async () => {
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
      const typicalNote =
        "15/01/2025 Contact avec M. Martin (DDETS) : " +
        "RDV prévu le 20/01 pour discuter budget 2025. " +
        "À préparer : documents financiers N-1.";

      await user.type(textarea, typicalNote);

      await waitFor(() => {
        expect(textarea).toHaveValue(typicalNote);
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
});
