import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FieldSetDescription } from "@/app/components/forms/fieldsets/structure/FieldSetDescription";
import { FormKind } from "@/types/global";
import { PublicType, StructureType } from "@/types/structure.type";

import {
  FormTestWrapper,
  resetAllMocks,
} from "../../../test-utils/form-test-wrapper";

// Mock the OperateurAutocomplete component
vi.mock("@/app/components/forms/OperateurAutocomplete", () => ({
  OperateurAutocomplete: () => <div data-testid="operateur-autocomplete" />,
}));

// Mock auto-animate
vi.mock("@formkit/auto-animate", () => ({
  default: vi.fn(),
}));

describe("FieldSetDescription", () => {
  const defaultDnaCode = "C0001";

  beforeEach(() => {
    resetAllMocks();
  });

  describe("Rendering with FormKind.FINALISATION", () => {
    it("should render all fields correctly", () => {
      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            dnaCode: defaultDnaCode,
            type: StructureType.CADA,
            operateur: { id: 1, name: "Adoma" },
            filiale: "",
            creationDate: "01/01/2020",
            finessCode: "123456789",
            public: PublicType.TOUT_PUBLIC,
            lgbt: false,
            fvvTeh: false,
            cpom: false,
          }}
        >
          <FieldSetDescription
            dnaCode={defaultDnaCode}
            formKind={FormKind.FINALISATION}
          />
        </FormTestWrapper>
      );

      expect(screen.getByText("Description")).toBeInTheDocument();

      expect(
        screen.getByRole("checkbox", {
          name: /Cette structure appartient-elle à une filiale/i,
        })
      ).toBeInTheDocument();

      expect(screen.getByLabelText("Type")).toBeInTheDocument();

      expect(screen.getByTestId("operateur-autocomplete")).toBeInTheDocument();

      expect(
        screen.getByLabelText("Date de création de la structure")
      ).toBeInTheDocument();

      expect(screen.getByLabelText("Public")).toBeInTheDocument();

      const lgbtTexts = screen.getAllByText(/LGBT/i);
      expect(lgbtTexts.length).toBeGreaterThan(0);

      expect(screen.getByLabelText("LGBT")).toBeInTheDocument();

      expect(screen.getByLabelText("FVV et TEH")).toBeInTheDocument();

      const cpomToggle = screen.getByTitle("CPOM");
      expect(cpomToggle).toBeInTheDocument();

      const hiddenInput = container.querySelector(
        'input[type="hidden"][id="dnaCode"]'
      );
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveValue(defaultDnaCode);
    });

    it("should render FINESS field for autorisée structure types", () => {
      const autoriseeTypes = [StructureType.CADA, StructureType.CPH];

      autoriseeTypes.forEach((type) => {
        const { unmount } = render(
          <FormTestWrapper
            defaultValues={{
              type,
              operateur: { id: 1, name: "Adoma" },
            }}
          >
            <FieldSetDescription
              dnaCode={defaultDnaCode}
              formKind={FormKind.FINALISATION}
            />
          </FormTestWrapper>
        );

        expect(screen.getByLabelText("Code FINESS")).toBeInTheDocument();
        unmount();
      });
    });

    it("should not render FINESS field for subventionnée structure types", () => {
      const subventionneeTypes = [StructureType.HUDA, StructureType.CAES];

      subventionneeTypes.forEach((type) => {
        const { unmount } = render(
          <FormTestWrapper
            defaultValues={{
              type,
              operateur: { id: 1, name: "Adoma" },
            }}
          >
            <FieldSetDescription
              dnaCode={defaultDnaCode}
              formKind={FormKind.FINALISATION}
            />
          </FormTestWrapper>
        );

        expect(screen.queryByLabelText("Code FINESS")).not.toBeInTheDocument();
        unmount();
      });
    });

    it("should have all public type options", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            operateur: { id: 1, name: "Adoma" },
          }}
        >
          <FieldSetDescription
            dnaCode={defaultDnaCode}
            formKind={FormKind.FINALISATION}
          />
        </FormTestWrapper>
      );

      const publicSelect = screen.getByLabelText("Public") as HTMLSelectElement;
      const options = Array.from(publicSelect.options).map((opt) => opt.value);

      expect(options).toContain(PublicType.TOUT_PUBLIC);
      expect(options).toContain(PublicType.FAMILLE);
      expect(options).toContain(PublicType.PERSONNES_ISOLEES);
    });
  });

  describe("Rendering with FormKind.MODIFICATION", () => {
    it("should render with Général legend", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            operateur: { id: 1, name: "Adoma" },
          }}
        >
          <FieldSetDescription
            dnaCode={defaultDnaCode}
            formKind={FormKind.MODIFICATION}
          />
        </FormTestWrapper>
      );

      expect(screen.getByText("Général")).toBeInTheDocument();
      expect(screen.queryByText("Description")).not.toBeInTheDocument();
    });

    it("should not render filiale toggle and creation date", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            operateur: { id: 1, name: "Adoma" },
          }}
        >
          <FieldSetDescription
            dnaCode={defaultDnaCode}
            formKind={FormKind.MODIFICATION}
          />
        </FormTestWrapper>
      );

      expect(
        screen.queryByText(/Cette structure appartient-elle à une filiale/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText("Date de création de la structure")
      ).not.toBeInTheDocument();
    });
  });

  describe("Filiale toggle interaction", () => {
    it("should show filiale input when toggle is activated", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            operateur: { id: 1, name: "Adoma" },
            filiale: "",
          }}
        >
          <FieldSetDescription
            dnaCode={defaultDnaCode}
            formKind={FormKind.FINALISATION}
          />
        </FormTestWrapper>
      );

      expect(screen.queryByLabelText("Filiale")).not.toBeInTheDocument();

      const toggle = screen.getByRole("checkbox", {
        name: /Cette structure appartient-elle à une filiale/i,
      });
      await user.click(toggle);

      await waitFor(() => {
        expect(screen.getByLabelText("Filiale")).toBeInTheDocument();
      });
    });

    it("should hide filiale input when toggle is deactivated", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            operateur: { id: 1, name: "Adoma" },
            filiale: "",
          }}
        >
          <FieldSetDescription
            dnaCode={defaultDnaCode}
            formKind={FormKind.FINALISATION}
          />
        </FormTestWrapper>
      );

      const toggle = screen.getByRole("checkbox", {
        name: /Cette structure appartient-elle à une filiale/i,
      });

      // First click - show filiale field
      await user.click(toggle);

      await waitFor(() => {
        expect(screen.getByLabelText("Filiale")).toBeInTheDocument();
      });

      // Second click - hide filiale field
      await user.click(toggle);

      await waitFor(() => {
        expect(screen.queryByLabelText("Filiale")).not.toBeInTheDocument();
      });
    });
  });

  describe("CPOM toggle interaction", () => {
    it("should toggle CPOM value", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            operateur: { id: 1, name: "Adoma" },
            cpom: false,
          }}
        >
          <FieldSetDescription
            dnaCode={defaultDnaCode}
            formKind={FormKind.FINALISATION}
          />
        </FormTestWrapper>
      );

      const cpomToggle = screen.getByLabelText(
        "Actuellement, la structure fait-elle partie d’un CPOM ?"
      );

      // Initially CPOM should be unchecked
      expect(cpomToggle).not.toBeChecked();

      await user.click(cpomToggle);

      // After toggle, CPOM should be checked
      await waitFor(() => {
        expect(cpomToggle).toBeChecked();
      });
    });
  });

  describe("LGBT and FVV/TEH checkboxes", () => {
    it("should toggle LGBT checkbox", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            operateur: { id: 1, name: "Adoma" },
            lgbt: false,
          }}
        >
          <FieldSetDescription
            dnaCode={defaultDnaCode}
            formKind={FormKind.FINALISATION}
          />
        </FormTestWrapper>
      );

      const lgbtCheckbox = screen.getByLabelText("LGBT") as HTMLInputElement;
      expect(lgbtCheckbox.checked).toBe(false);

      await user.click(lgbtCheckbox);

      await waitFor(() => {
        expect(lgbtCheckbox.checked).toBe(true);
      });
    });

    it("should toggle FVV/TEH checkbox", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            operateur: { id: 1, name: "Adoma" },
            fvvTeh: false,
          }}
        >
          <FieldSetDescription
            dnaCode={defaultDnaCode}
            formKind={FormKind.FINALISATION}
          />
        </FormTestWrapper>
      );

      const fvvTehCheckbox = screen.getByLabelText(
        "FVV et TEH"
      ) as HTMLInputElement;
      expect(fvvTehCheckbox.checked).toBe(false);

      await user.click(fvvTehCheckbox);

      await waitFor(() => {
        expect(fvvTehCheckbox.checked).toBe(true);
      });
    });
  });

  describe("Type selection", () => {
    it("should have all structure types except PRAHDA", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            operateur: { id: 1, name: "Adoma" },
          }}
        >
          <FieldSetDescription
            dnaCode={defaultDnaCode}
            formKind={FormKind.FINALISATION}
          />
        </FormTestWrapper>
      );

      const typeSelect = screen.getByLabelText("Type") as HTMLSelectElement;
      const options = Array.from(typeSelect.options).map((opt) => opt.value);

      expect(options).toContain(StructureType.CADA);
      expect(options).toContain(StructureType.HUDA);
      expect(options).toContain(StructureType.CPH);
      expect(options).toContain(StructureType.CAES);
      expect(options).not.toContain(StructureType.PRAHDA);
    });

    it("should be disabled when disableTypes is true", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            operateur: { id: 1, name: "Adoma" },
          }}
        >
          <FieldSetDescription
            dnaCode={defaultDnaCode}
            disableTypes={true}
            formKind={FormKind.FINALISATION}
          />
        </FormTestWrapper>
      );

      const typeSelect = screen.getByLabelText("Type") as HTMLSelectElement;
      expect(typeSelect.disabled).toBe(true);
    });

    it("should update FINESS field visibility when type changes", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.HUDA, // subventionnée (no FINESS)
            operateur: { id: 1, name: "Adoma" },
          }}
        >
          <FieldSetDescription
            dnaCode={defaultDnaCode}
            disableTypes={false}
            formKind={FormKind.FINALISATION}
          />
        </FormTestWrapper>
      );

      // Initially no FINESS field for HUDA (subventionnée)
      expect(screen.queryByLabelText("Code FINESS")).not.toBeInTheDocument();

      // Change to CPH (autorisée)
      const typeSelect = screen.getByLabelText("Type");
      await user.selectOptions(typeSelect, StructureType.CPH);

      // FINESS field should appear
      await waitFor(() => {
        expect(screen.getByLabelText("Code FINESS")).toBeInTheDocument();
      });
    });
  });

  describe("Notice display", () => {
    it("should display LGBT/FVV/TEH explanation notice", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            operateur: { id: 1, name: "Adoma" },
          }}
        >
          <FieldSetDescription
            dnaCode={defaultDnaCode}
            formKind={FormKind.FINALISATION}
          />
        </FormTestWrapper>
      );

      expect(
        screen.getByText(/LGBT : Lesbiennes, Gays, Bisexuels et Transgenres/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/FVV : Femmes Victimes de Violences/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/TEH : Traîte des Êtres Humains/i)
      ).toBeInTheDocument();
    });
  });
});
