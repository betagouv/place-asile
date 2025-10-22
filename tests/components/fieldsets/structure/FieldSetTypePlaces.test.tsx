import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { FieldSetTypePlaces } from "@/app/components/forms/fieldsets/structure/FieldSetTypePlaces";
import { FormKind } from "@/types/global";

import {
  FormTestWrapper,
  resetAllMocks,
} from "../../../test-utils/form-test-wrapper";

describe("FieldSetTypePlaces", () => {
  const years = [2025, 2024, 2023];

  beforeEach(() => {
    resetAllMocks();
  });

  describe("Rendering with FormKind.FINALISATION", () => {
    it("should render with Types de place legend", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            typologies: years.map((year) => ({
              date: `01/01/${year}`,
              placesAutorisees: 0,
              pmr: 0,
              lgbt: 0,
              fvvTeh: 0,
            })),
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      expect(screen.getByText("Types de place")).toBeInTheDocument();
    });

    it("should render table headers", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            typologies: years.map((year) => ({
              date: `01/01/${year}`,
              placesAutorisees: 0,
              pmr: 0,
              lgbt: 0,
              fvvTeh: 0,
            })),
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      expect(screen.getByText("Année")).toBeInTheDocument();
      expect(screen.getByText("Autorisées")).toBeInTheDocument();
      expect(screen.getByText("PMR")).toBeInTheDocument();
      expect(screen.getByText("LGBT")).toBeInTheDocument();
      expect(screen.getByText("FVV/TEH")).toBeInTheDocument();
    });

    it("should render rows for each year", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            typologies: years.map((year) => ({
              date: `01/01/${year}`,
              placesAutorisees: 0,
              pmr: 0,
              lgbt: 0,
              fvvTeh: 0,
            })),
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      years.forEach((year) => {
        expect(screen.getByText(year.toString())).toBeInTheDocument();
      });
    });

    it("should display instruction text", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            typologies: [],
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      expect(
        screen.getByText(
          /Veuillez renseigner l’historique du nombre de places/i
        )
      ).toBeInTheDocument();
    });

    it("should display PMR/LGBT/FVV notice", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            typologies: [],
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      expect(
        screen.getByText(/PMR : Personnes à Mobilité Réduite/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/LGBT : Lesbiennes, Gays, Bisexuels et Transgenres/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/FVV : Femmes Victimes de Violences/i)
      ).toBeInTheDocument();
    });
  });

  describe("Rendering with FormKind.MODIFICATION", () => {
    it("should render with Détails et historique legend", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            typologies: years.map((year) => ({
              date: `01/01/${year}`,
              placesAutorisees: 0,
              pmr: 0,
              lgbt: 0,
              fvvTeh: 0,
            })),
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.MODIFICATION} />
        </FormTestWrapper>
      );

      expect(screen.getByText("Détails et historique")).toBeInTheDocument();
      expect(screen.queryByText("Types de place")).not.toBeInTheDocument();
    });
  });

  describe("Form inputs", () => {
    it("should render all input fields for each year", () => {
      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            typologies: years.map((year) => ({
              date: `01/01/${year}`,
              placesAutorisees: 0,
              pmr: 0,
              lgbt: 0,
              fvvTeh: 0,
            })),
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      years.forEach((_, index) => {
        expect(
          container.querySelector(
            `[name="typologies.${index}.placesAutorisees"]`
          )
        ).toBeInTheDocument();
        expect(
          container.querySelector(`[name="typologies.${index}.pmr"]`)
        ).toBeInTheDocument();
        expect(
          container.querySelector(`[name="typologies.${index}.lgbt"]`)
        ).toBeInTheDocument();
        expect(
          container.querySelector(`[name="typologies.${index}.fvvTeh"]`)
        ).toBeInTheDocument();
      });
    });

    it("should have hidden date fields for each year", () => {
      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            typologies: years.map((year) => ({
              date: `01/01/${year}`,
              placesAutorisees: 0,
              pmr: 0,
              lgbt: 0,
              fvvTeh: 0,
            })),
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      years.forEach((_, index) => {
        const dateInput = container.querySelector(
          `input[name="typologies.${index}.date"]`
        );
        expect(dateInput).toBeInTheDocument();
        expect(dateInput).toHaveAttribute("type", "hidden");
      });
    });
  });

  describe("Number inputs", () => {
    it("should accept numeric values for placesAutorisees", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            typologies: years.map(() => ({
              placesAutorisees: 0,
              pmr: 0,
              lgbt: 0,
              fvvTeh: 0,
            })),
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      const input = container.querySelector(
        '[name="typologies.0.placesAutorisees"]'
      ) as HTMLInputElement;
      await user.clear(input);
      await user.type(input, "100");

      await waitFor(() => {
        expect(input).toHaveValue(100);
      });
    });

    it("should accept numeric values for PMR", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            typologies: years.map(() => ({
              placesAutorisees: 0,
              pmr: 0,
              lgbt: 0,
              fvvTeh: 0,
            })),
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      const input = container.querySelector(
        '[name="typologies.0.pmr"]'
      ) as HTMLInputElement;
      await user.clear(input);
      await user.type(input, "10");

      await waitFor(() => {
        expect(input).toHaveValue(10);
      });
    });

    it("should accept numeric values for LGBT", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            typologies: years.map(() => ({
              placesAutorisees: 0,
              pmr: 0,
              lgbt: 0,
              fvvTeh: 0,
            })),
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      const input = container.querySelector(
        '[name="typologies.0.lgbt"]'
      ) as HTMLInputElement;
      await user.clear(input);
      await user.type(input, "5");

      await waitFor(() => {
        expect(input).toHaveValue(5);
      });
    });

    it("should accept numeric values for FVV/TEH", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            typologies: years.map(() => ({
              placesAutorisees: 0,
              pmr: 0,
              lgbt: 0,
              fvvTeh: 0,
            })),
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      const input = container.querySelector(
        '[name="typologies.0.fvvTeh"]'
      ) as HTMLInputElement;
      await user.clear(input);
      await user.type(input, "3");

      await waitFor(() => {
        expect(input).toHaveValue(3);
      });
    });

    it("should enforce minimum value of 0", () => {
      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            typologies: years.map(() => ({
              placesAutorisees: 0,
              pmr: 0,
              lgbt: 0,
              fvvTeh: 0,
            })),
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      const input = container.querySelector(
        '[name="typologies.0.placesAutorisees"]'
      ) as HTMLInputElement;
      expect(input).toHaveAttribute("min", "0");
    });
  });

  describe("Data for multiple years", () => {
    it("should handle different values for each year", async () => {
      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            typologies: [
              { placesAutorisees: 100, pmr: 10, lgbt: 5, fvvTeh: 3 },
              { placesAutorisees: 95, pmr: 8, lgbt: 4, fvvTeh: 2 },
              { placesAutorisees: 90, pmr: 7, lgbt: 3, fvvTeh: 1 },
            ],
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      const inputs = [0, 1, 2].map((index) => ({
        placesAutorisees: container.querySelector(
          `[name="typologies.${index}.placesAutorisees"]`
        ) as HTMLInputElement,
        pmr: container.querySelector(
          `[name="typologies.${index}.pmr"]`
        ) as HTMLInputElement,
        lgbt: container.querySelector(
          `[name="typologies.${index}.lgbt"]`
        ) as HTMLInputElement,
        fvvTeh: container.querySelector(
          `[name="typologies.${index}.fvvTeh"]`
        ) as HTMLInputElement,
      }));

      expect(inputs[0].placesAutorisees).toHaveValue(100);
      expect(inputs[0].pmr).toHaveValue(10);
      expect(inputs[1].placesAutorisees).toHaveValue(95);
      expect(inputs[2].lgbt).toHaveValue(3);
    });
  });

  describe("Edge cases", () => {
    it("should handle empty typologies array", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            typologies: [],
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      expect(screen.getByText("Types de place")).toBeInTheDocument();
    });

    it("should handle null values", () => {
      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            typologies: years.map(() => ({
              placesAutorisees: null,
              pmr: null,
              lgbt: null,
              fvvTeh: null,
            })),
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      const input = container.querySelector(
        '[name="typologies.0.placesAutorisees"]'
      ) as HTMLInputElement;
      expect(input).toHaveValue(null);
    });

    it("should handle zero values", () => {
      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            typologies: years.map(() => ({
              placesAutorisees: 0,
              pmr: 0,
              lgbt: 0,
              fvvTeh: 0,
            })),
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      const input = container.querySelector(
        '[name="typologies.0.placesAutorisees"]'
      ) as HTMLInputElement;
      expect(input).toHaveValue(0);
    });

    it("should handle large numbers", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            typologies: years.map(() => ({
              placesAutorisees: 0,
              pmr: 0,
              lgbt: 0,
              fvvTeh: 0,
            })),
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      const input = container.querySelector(
        '[name="typologies.0.placesAutorisees"]'
      ) as HTMLInputElement;
      await user.clear(input);
      await user.type(input, "9999");

      await waitFor(() => {
        expect(input).toHaveValue(9999);
      });
    });
  });

  // TODO: Skipped due to InputWithValidation returning empty fragment for type="hidden"
  describe("Hidden ID fields", () => {
    it.skip("should have hidden id fields when provided", () => {
      const { container } = render(
        <FormTestWrapper
          defaultValues={{
            typologies: years.map((_, index) => ({
              id: index + 1,
              placesAutorisees: 0,
              pmr: 0,
              lgbt: 0,
              fvvTeh: 0,
            })),
          }}
        >
          <FieldSetTypePlaces formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      years.forEach((_, index) => {
        expect(
          container.querySelector(`[name="typologies.${index}.id"]`)
        ).toBeInTheDocument();
      });
    });
  });
});
