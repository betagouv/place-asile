import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { FieldSetCalendrier } from "@/app/components/forms/fieldsets/structure/FieldSetCalendrier";
import { StructureType } from "@/types/structure.type";

import {
  FormTestWrapper,
  resetAllMocks,
} from "../../../test-utils/form-test-wrapper";

describe("FieldSetCalendrier", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Rendering with autorisée structure (CADA)", () => {
    it("should render all three date sections for autorisée with CPOM", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            cpom: true,
            debutPeriodeAutorisation: "01/01/2024",
            finPeriodeAutorisation: "31/12/2028",
            debutConvention: "01/01/2024",
            finConvention: "31/12/2028",
            debutCpom: "01/01/2024",
            finCpom: "31/12/2028",
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      expect(screen.getByText(/Calendrier/i)).toBeInTheDocument();
      const dateDebuts = screen.getAllByLabelText(/Date de début/i);
      const dateFins = screen.getAllByLabelText(/Date de fin/i);
      expect(dateDebuts.length).toBe(3);
      expect(dateFins.length).toBe(3);
    });

    it("should render only autorisation and convention sections without CPOM", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            cpom: false,
            debutPeriodeAutorisation: "01/01/2024",
            finPeriodeAutorisation: "31/12/2028",
            debutConvention: "01/01/2024",
            finConvention: "31/12/2028",
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      const dateDebuts = screen.getAllByLabelText(/Date de début/i);
      const dateFins = screen.getAllByLabelText(/Date de fin/i);
      expect(dateDebuts.length).toBe(2);
      expect(dateFins.length).toBe(2);
    });

    it("should show optional label for convention section", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            cpom: false,
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      expect(
        screen.getByText("Convention en cours (optionnel)")
      ).toBeInTheDocument();
    });

    it("should display notice about optional convention", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            cpom: false,
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      expect(
        screen.getByText(/Uniquement si votre structure est sous convention/i)
      ).toBeInTheDocument();
    });
  });

  describe("Rendering with subventionnée structure (HUDA)", () => {
    it("should not render autorisation period section", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.HUDA,
            cpom: false,
            debutConvention: "01/01/2024",
            finConvention: "31/12/2028",
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      expect(
        screen.queryByText("Période d'autorisation en cours")
      ).not.toBeInTheDocument();
      expect(screen.getByText(/Convention en cours/i)).toBeInTheDocument();
    });

    it("should not show optional label for convention", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.HUDA,
            cpom: false,
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      expect(screen.queryByText(/\(optionnel\)/i)).not.toBeInTheDocument();
    });

    it("should show CPOM section when cpom is true", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CPH,
            cpom: true,
            debutCpom: "01/01/2024",
            finCpom: "31/12/2028",
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      expect(screen.getByText("CPOM en cours")).toBeInTheDocument();
    });
  });

  describe("Autorisation period fields", () => {
    it("should render debut and fin autorisation fields", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            debutPeriodeAutorisation: "01/01/2024",
            finPeriodeAutorisation: "31/12/2028",
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      const dateLabels = screen.getAllByLabelText("Date de début");
      const dateFinLabels = screen.getAllByLabelText("Date de fin");

      // First set should be autorisation dates
      expect(dateLabels[0]).toBeInTheDocument();
      expect(dateFinLabels[0]).toBeInTheDocument();
    });

    it("should update debut autorisation date", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            debutPeriodeAutorisation: "",
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      const debutInput = screen.getAllByLabelText("Date de début")[0];
      await user.type(debutInput, "2024-01-01");

      await waitFor(() => {
        expect(debutInput).toHaveValue("2024-01-01");
      });
    });

    it("should update fin autorisation date", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            finPeriodeAutorisation: "",
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      const finInput = screen.getAllByLabelText("Date de fin")[0];
      await user.type(finInput, "2028-12-31");

      await waitFor(() => {
        expect(finInput).toHaveValue("2028-12-31");
      });
    });
  });

  describe("Convention fields", () => {
    it("should render debut and fin convention fields", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CPH,
            debutConvention: "01/01/2024",
            finConvention: "31/12/2028",
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      expect(screen.getAllByLabelText("Date de début").length).toBeGreaterThan(
        0
      );
      expect(screen.getAllByLabelText("Date de fin").length).toBeGreaterThan(0);
    });

    it("should update debut convention date", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CPH,
            cpom: false,
            debutConvention: "",
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      const debutInput = screen.getAllByLabelText("Date de début")[0];
      await user.type(debutInput, "2024-01-15");

      await waitFor(() => {
        expect(debutInput).toHaveValue("2024-01-15");
      });
    });

    it("should update fin convention date", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CPH,
            cpom: false,
            finConvention: "",
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      const finInput = screen.getAllByLabelText("Date de fin")[0];
      await user.type(finInput, "2028-06-30");

      await waitFor(() => {
        expect(finInput).toHaveValue("2028-06-30");
      });
    });
  });

  describe("CPOM fields", () => {
    it("should render CPOM fields when cpom is true", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            cpom: true,
            debutCpom: "01/01/2024",
            finCpom: "31/12/2028",
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      expect(screen.getByText("CPOM en cours")).toBeInTheDocument();
      // CPOM dates would be the last pair
      const dateLabels = screen.getAllByLabelText("Date de début");
      const dateFinLabels = screen.getAllByLabelText("Date de fin");

      // Should have 3 pairs: autorisation, convention, CPOM
      expect(dateLabels.length).toBe(3);
      expect(dateFinLabels.length).toBe(3);
    });

    it("should not render CPOM fields when cpom is false", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            cpom: false,
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      expect(screen.queryByText("CPOM en cours")).not.toBeInTheDocument();
    });

    it("should update debut CPOM date", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            cpom: true,
            debutCpom: "",
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      const dateInputs = screen.getAllByLabelText("Date de début");
      const cpomDebutInput = dateInputs[dateInputs.length - 1];
      await user.type(cpomDebutInput, "2024-03-01");

      await waitFor(() => {
        expect(cpomDebutInput).toHaveValue("2024-03-01");
      });
    });

    it("should update fin CPOM date", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            cpom: true,
            finCpom: "",
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      const dateInputs = screen.getAllByLabelText("Date de fin");
      const cpomFinInput = dateInputs[dateInputs.length - 1];
      await user.type(cpomFinInput, "2029-02-28");

      await waitFor(() => {
        expect(cpomFinInput).toHaveValue("2029-02-28");
      });
    });
  });

  describe("Conditional rendering based on structure type", () => {
    const autoriseeTypes = [StructureType.CADA, StructureType.CPH];
    const subventionneeTypes = [StructureType.HUDA, StructureType.CAES];

    autoriseeTypes.forEach((type) => {
      it(`should show autorisation section for ${type}`, () => {
        render(
          <FormTestWrapper
            defaultValues={{
              type,
              cpom: false,
            }}
          >
            <FieldSetCalendrier />
          </FormTestWrapper>
        );

        // Verify autorisation section exists by checking for its date fields
        expect(
          screen.getAllByLabelText(/Date de début/i).length
        ).toBeGreaterThanOrEqual(1);
      });
    });

    subventionneeTypes.forEach((type) => {
      it(`should not show autorisation section for ${type}`, () => {
        render(
          <FormTestWrapper
            defaultValues={{
              type,
              cpom: false,
            }}
          >
            <FieldSetCalendrier />
          </FormTestWrapper>
        );

        expect(
          screen.queryByText("Période d'autorisation en cours")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle null date values", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            cpom: true,
            debutPeriodeAutorisation: null,
            finPeriodeAutorisation: null,
            debutConvention: null,
            finConvention: null,
            debutCpom: null,
            finCpom: null,
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      const dateInputs = screen.getAllByLabelText("Date de début");
      dateInputs.forEach((input) => {
        expect(input).toHaveValue("");
      });
    });

    it("should handle CADA with CPOM showing all sections", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            cpom: true,
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      // Check all three date field pairs exist
      const dateDebuts = screen.getAllByLabelText(/Date de début/i);
      const dateFins = screen.getAllByLabelText(/Date de fin/i);

      expect(dateDebuts.length).toBe(3); // autorisation, convention, CPOM
      expect(dateFins.length).toBe(3);
    });

    it("should handle HUDA without CPOM showing only convention", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.HUDA,
            cpom: false,
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      expect(
        screen.queryByText("Période d'autorisation en cours")
      ).not.toBeInTheDocument();
      expect(screen.getByText(/Convention en cours/i)).toBeInTheDocument();
      expect(screen.queryByText("CPOM en cours")).not.toBeInTheDocument();

      // Should only have one pair of date inputs
      const dateInputs = screen.getAllByLabelText("Date de début");
      expect(dateInputs.length).toBe(1);
    });
  });

  describe("Field names", () => {
    it("should have correct name attributes for autorisation dates", () => {
      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            cpom: false,
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      expect(
        container.querySelector('[name="debutPeriodeAutorisation"]')
      ).toBeInTheDocument();
      expect(
        container.querySelector('[name="finPeriodeAutorisation"]')
      ).toBeInTheDocument();
    });

    it("should have correct name attributes for convention dates", () => {
      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CPH,
            cpom: false,
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      expect(
        container.querySelector('[name="debutConvention"]')
      ).toBeInTheDocument();
      expect(
        container.querySelector('[name="finConvention"]')
      ).toBeInTheDocument();
    });

    it("should have correct name attributes for CPOM dates", () => {
      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            type: StructureType.CADA,
            cpom: true,
          }}
        >
          <FieldSetCalendrier />
        </FormTestWrapper>
      );

      expect(container.querySelector('[name="debutCpom"]')).toBeInTheDocument();
      expect(container.querySelector('[name="finCpom"]')).toBeInTheDocument();
    });
  });
});
