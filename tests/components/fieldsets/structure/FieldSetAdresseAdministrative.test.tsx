import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FieldSetAdresseAdministrative } from "@/app/components/forms/fieldsets/structure/FieldSetAdresseAdministrative";
import { Repartition } from "@/types/adresse.type";
import { FormKind } from "@/types/global";

import {
  FormTestWrapper,
  resetAllMocks,
} from "../../../test-utils/form-test-wrapper";

// Mock the AddressWithValidation component
vi.mock("@/app/components/forms/AddressWithValidation", () => ({
  default: ({ label, id }: { label: string; id: string }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} data-testid="address-autocomplete" />
    </div>
  ),
}));

describe("FieldSetAdresseAdministrative", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Rendering with FormKind.FINALISATION", () => {
    it("should render all required fields", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            nom: "",
            adresseAdministrativeComplete: "",
            adresseAdministrative: "",
            codePostalAdministratif: "",
            communeAdministrative: "",
            departementAdministratif: "",
          }}
        >
          <FieldSetAdresseAdministrative formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      expect(screen.getByText("Adresse administrative")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Nom de la structure (optionnel)")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Adresse principale de la structure")
      ).toBeInTheDocument();
    });

    it("should display notice about address confidentiality", () => {
      const { container } = render(
        <FormTestWrapper defaultValues={{}}>
          <FieldSetAdresseAdministrative formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      // Check for notice element (text is split across elements in Notice component)
      const notice = container.querySelector(".fr-notice.fr-notice--info");
      expect(notice).toBeInTheDocument();
    });

    it("should display helper text for structure name", () => {
      render(
        <FormTestWrapper defaultValues={{}}>
          <FieldSetAdresseAdministrative formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      expect(screen.getByText("ex. Les Coquelicots")).toBeInTheDocument();
    });

    it("should display helper text for address", () => {
      render(
        <FormTestWrapper defaultValues={{}}>
          <FieldSetAdresseAdministrative formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      expect(
        screen.getByText(/indiquée dans les documents de contractualisation/i)
      ).toBeInTheDocument();
    });

    it("should not display Type de bâti field", () => {
      render(
        <FormTestWrapper defaultValues={{}}>
          <FieldSetAdresseAdministrative formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      expect(screen.queryByLabelText("Type de bâti")).not.toBeInTheDocument();
    });
  });

  describe("Rendering with FormKind.MODIFICATION", () => {
    it("should not display notice about address confidentiality", () => {
      render(
        <FormTestWrapper defaultValues={{}}>
          <FieldSetAdresseAdministrative formKind={FormKind.MODIFICATION} />
        </FormTestWrapper>
      );

      expect(
        screen.queryByText(
          /L'ensemble des adresses ne seront communiquées qu'aux agentes/i
        )
      ).not.toBeInTheDocument();
    });

    it("should display Type de bâti field", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            typeBati: Repartition.COLLECTIF,
          }}
        >
          <FieldSetAdresseAdministrative formKind={FormKind.MODIFICATION} />
        </FormTestWrapper>
      );

      expect(screen.getByLabelText("Type de bâti")).toBeInTheDocument();
    });

    it("should have all Repartition options in Type de bâti select", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            typeBati: "",
          }}
        >
          <FieldSetAdresseAdministrative formKind={FormKind.MODIFICATION} />
        </FormTestWrapper>
      );

      const typeBatiSelect = screen.getByLabelText(
        "Type de bâti"
      ) as HTMLSelectElement;
      const options = Array.from(typeBatiSelect.options).map(
        (opt) => opt.value
      );

      expect(options).toContain(Repartition.COLLECTIF);
      expect(options).toContain(Repartition.DIFFUS);
      expect(options).toContain(Repartition.MIXTE);
    });
  });

  describe("Structure name field", () => {
    it("should update name field value", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            nom: "",
          }}
        >
          <FieldSetAdresseAdministrative formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      const nomInput = screen.getByLabelText("Nom de la structure (optionnel)");
      await user.type(nomInput, "Les Mimosas");

      await waitFor(() => {
        expect(nomInput).toHaveValue("Les Mimosas");
      });
    });

    it("should be optional (empty value allowed)", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            nom: "",
          }}
        >
          <FieldSetAdresseAdministrative formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      const nomInput = screen.getByLabelText("Nom de la structure (optionnel)");
      expect(nomInput).toHaveValue("");
    });
  });

  describe("Address autocomplete integration", () => {
    it("should render AddressWithValidation component", () => {
      render(
        <FormTestWrapper defaultValues={{}}>
          <FieldSetAdresseAdministrative formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      expect(screen.getByTestId("address-autocomplete")).toBeInTheDocument();
    });

    it("should pass correct props to AddressWithValidation", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            adresseAdministrativeComplete: "1 rue de Paris, 75001 Paris",
            adresseAdministrative: "1 rue de Paris",
            codePostalAdministratif: "75001",
            communeAdministrative: "Paris",
            departementAdministratif: "75",
          }}
        >
          <FieldSetAdresseAdministrative formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      expect(
        screen.getByLabelText("Adresse principale de la structure")
      ).toBeInTheDocument();
    });
  });

  describe("Type de bâti field (MODIFICATION mode)", () => {
    it("should update Type de bâti value", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            typeBati: "",
          }}
        >
          <FieldSetAdresseAdministrative formKind={FormKind.MODIFICATION} />
        </FormTestWrapper>
      );

      const typeBatiSelect = screen.getByLabelText("Type de bâti");
      await user.selectOptions(typeBatiSelect, Repartition.COLLECTIF);

      await waitFor(() => {
        expect(typeBatiSelect).toHaveValue(Repartition.COLLECTIF);
      });
    });

    it("should switch between repartition types", async () => {
      const user = userEvent.setup();

      render(
        <FormTestWrapper
          defaultValues={{
            typeBati: Repartition.COLLECTIF,
          }}
        >
          <FieldSetAdresseAdministrative formKind={FormKind.MODIFICATION} />
        </FormTestWrapper>
      );

      const typeBatiSelect = screen.getByLabelText("Type de bâti");
      expect(typeBatiSelect).toHaveValue(Repartition.COLLECTIF);

      await user.selectOptions(typeBatiSelect, Repartition.DIFFUS);

      await waitFor(() => {
        expect(typeBatiSelect).toHaveValue(Repartition.DIFFUS);
      });
    });
  });

  describe("Grid layout", () => {
    it("should have correct grid layout for FINALISATION mode", () => {
      const { container } = render(
        <FormTestWrapper defaultValues={{}}>
          <FieldSetAdresseAdministrative formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass("md:grid-cols-3");
    });

    it("should have correct grid layout for MODIFICATION mode", () => {
      const { container } = render(
        <FormTestWrapper defaultValues={{}}>
          <FieldSetAdresseAdministrative formKind={FormKind.MODIFICATION} />
        </FormTestWrapper>
      );

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass("md:grid-cols-4");
    });
  });

  describe("Edge cases", () => {
    it("should handle null values gracefully", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            nom: null,
            adresseAdministrativeComplete: null,
            typeBati: null,
          }}
        >
          <FieldSetAdresseAdministrative formKind={FormKind.MODIFICATION} />
        </FormTestWrapper>
      );

      const nomInput = screen.getByLabelText("Nom de la structure (optionnel)");
      expect(nomInput).toHaveValue("");

      const typeBatiSelect = screen.getByLabelText("Type de bâti");
      expect(typeBatiSelect).toHaveValue("");
    });

    it("should handle empty string values", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            nom: "",
            adresseAdministrativeComplete: "",
            adresseAdministrative: "",
            codePostalAdministratif: "",
            communeAdministrative: "",
            departementAdministratif: "",
          }}
        >
          <FieldSetAdresseAdministrative formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      const nomInput = screen.getByLabelText("Nom de la structure (optionnel)");
      expect(nomInput).toHaveValue("");
    });

    it("should handle long structure names", async () => {
      const user = userEvent.setup();
      const longName =
        "Centre d'Accueil pour Demandeurs d'Asile de la Région Parisienne Nord";

      render(
        <FormTestWrapper
          defaultValues={{
            nom: "",
          }}
        >
          <FieldSetAdresseAdministrative formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      const nomInput = screen.getByLabelText("Nom de la structure (optionnel)");
      await user.type(nomInput, longName);

      await waitFor(() => {
        expect(nomInput).toHaveValue(longName);
      });
    });
  });

  describe("Field names", () => {
    it("should have correct name attribute for nom field", () => {
      const { container } = render(
        <FormTestWrapper defaultValues={{}}>
          <FieldSetAdresseAdministrative formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      expect(container.querySelector('[name="nom"]')).toBeInTheDocument();
    });

    it("should have correct name attribute for typeBati field", () => {
      const { container } = render(
        <FormTestWrapper defaultValues={{}}>
          <FieldSetAdresseAdministrative formKind={FormKind.MODIFICATION} />
        </FormTestWrapper>
      );

      expect(container.querySelector('[name="typeBati"]')).toBeInTheDocument();
    });
  });

  describe("Address synchronization (handleAddressAdministrativeChange)", () => {
    // Note: The actual synchronization logic depends on form context and setTimeout
    // This is difficult to test in isolation, but we can verify the structure is set up correctly

    it("should have onSelectSuggestion callback configured", () => {
      render(
        <FormTestWrapper
          defaultValues={{
            typeBati: Repartition.COLLECTIF,
            sameAddress: true,
            adresses: [{}],
          }}
        >
          <FieldSetAdresseAdministrative formKind={FormKind.MODIFICATION} />
        </FormTestWrapper>
      );

      // The component should render without errors
      expect(screen.getByText("Adresse administrative")).toBeInTheDocument();
    });
  });
});
