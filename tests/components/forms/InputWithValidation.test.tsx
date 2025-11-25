import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import InputWithValidation from "@/app/components/forms/InputWithValidation";

import { FormTestWrapper } from "../../test-utils/form-test-wrapper";

describe("InputWithValidation", () => {
  describe("Edge cases - null and undefined values", () => {
    it("should handle null text values gracefully", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            testField: null,
          }}
        >
          <InputWithValidation
            name="testField"
            id="testField"
            type="text"
            label="Test Field"
          />
        </FormTestWrapper>
      );

      const input = screen.getByLabelText("Test Field");
      expect(input).toHaveValue("");
    });

    it("should handle undefined text values gracefully", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            testField: undefined,
          }}
        >
          <InputWithValidation
            name="testField"
            id="testField"
            type="text"
            label="Test Field"
          />
        </FormTestWrapper>
      );

      const input = screen.getByLabelText("Test Field");
      expect(input).toHaveValue("");
    });

    it("should handle null date values gracefully", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            testDate: null,
          }}
        >
          <InputWithValidation
            name="testDate"
            id="testDate"
            type="date"
            label="Test Date"
          />
        </FormTestWrapper>
      );

      const input = screen.getByLabelText("Test Date");
      expect(input).toHaveValue("");
    });

    it("should handle undefined date values gracefully", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            testDate: undefined,
          }}
        >
          <InputWithValidation
            name="testDate"
            id="testDate"
            type="date"
            label="Test Date"
          />
        </FormTestWrapper>
      );

      const input = screen.getByLabelText("Test Date");
      expect(input).toHaveValue("");
    });

    it("should handle null number values gracefully", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            testNumber: null,
          }}
        >
          <InputWithValidation
            name="testNumber"
            id="testNumber"
            type="number"
            label="Test Number"
          />
        </FormTestWrapper>
      );

      const input = screen.getByLabelText("Test Number");
      expect(input).toHaveValue(null);
    });
  });

  describe("Edge cases - empty values", () => {
    it("should handle empty string text values", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            testField: "",
          }}
        >
          <InputWithValidation
            name="testField"
            id="testField"
            type="text"
            label="Test Field"
          />
        </FormTestWrapper>
      );

      const input = screen.getByLabelText("Test Field");
      expect(input).toHaveValue("");
    });

    it("should handle empty string date values", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            testDate: "",
          }}
        >
          <InputWithValidation
            name="testDate"
            id="testDate"
            type="date"
            label="Test Date"
          />
        </FormTestWrapper>
      );

      const input = screen.getByLabelText("Test Date");
      expect(input).toHaveValue("");
    });
  });

  describe("Date format handling", () => {
    it("should handle DD/MM/YYYY format for dates", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            testDate: "15/01/2024",
          }}
        >
          <InputWithValidation
            name="testDate"
            id="testDate"
            type="date"
            label="Test Date"
          />
        </FormTestWrapper>
      );

      const input = screen.getByLabelText("Test Date");
      expect(input).toHaveValue("2024-01-15");
    });

    it("should handle YYYY-MM-DD format for dates", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            testDate: "2024-01-15",
          }}
        >
          <InputWithValidation
            name="testDate"
            id="testDate"
            type="date"
            label="Test Date"
          />
        </FormTestWrapper>
      );

      const input = screen.getByLabelText("Test Date");
      expect(input).toHaveValue("2024-01-15");
    });

    it("should convert date input from HTML format to DD/MM/YYYY", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            testDate: "",
          }}
        >
          <InputWithValidation
            name="testDate"
            id="testDate"
            type="date"
            label="Test Date"
          />
        </FormTestWrapper>
      );

      const input = screen.getByLabelText("Test Date");
      await user.type(input, "2024-01-15");

      await waitFor(() => {
        expect(input).toHaveValue("2024-01-15");
      });
    });
  });

  describe("Number input handling", () => {
    it("should handle empty number input", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            testNumber: "",
          }}
        >
          <InputWithValidation
            name="testNumber"
            id="testNumber"
            type="number"
            label="Test Number"
          />
        </FormTestWrapper>
      );

      const input = screen.getByLabelText("Test Number");

      expect(input).toHaveValue(null);

      await user.clear(input);

      await waitFor(() => {
        expect(input).toHaveValue(null);
      });
    });

    it("should handle number input correctly", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            testNumber: "",
          }}
        >
          <InputWithValidation
            name="testNumber"
            id="testNumber"
            type="number"
            label="Test Number"
          />
        </FormTestWrapper>
      );

      const input = screen.getByLabelText("Test Number");
      await user.type(input, "42");

      await waitFor(() => {
        expect(input).toHaveValue(42);
      });
    });
  });

  describe("Text input handling", () => {
    it("should handle text input correctly", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            testField: "",
          }}
        >
          <InputWithValidation
            name="testField"
            id="testField"
            type="text"
            label="Test Field"
          />
        </FormTestWrapper>
      );

      const input = screen.getByLabelText("Test Field");
      await user.type(input, "Test value");

      await waitFor(() => {
        expect(input).toHaveValue("Test value");
      });
    });
  });
});

