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

vi.mock("@/app/hooks/useAddressSuggestion", () => ({
  useAddressSuggestion: () => {
    return async () => [];
  },
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
  });

  describe("Address autocomplete integration", () => {
    it("should render AddressWithValidation component", () => {
      render(
        <FormTestWrapper defaultValues={{}}>
          <FieldSetAdresseAdministrative formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      expect(
        screen.getByLabelText("Adresse principale de la structure")
      ).toBeInTheDocument();
    });

    it("should pass correct props to AddressWithValidation and display address", () => {
      const testAddress = "1 rue de Paris, 75001 Paris";
      render(
        <FormTestWrapper
          defaultValues={{
            adresseAdministrativeComplete: testAddress,
            adresseAdministrative: "1 rue de Paris",
            codePostalAdministratif: "75001",
            communeAdministrative: "Paris",
            departementAdministratif: "75",
          }}
        >
          <FieldSetAdresseAdministrative formKind={FormKind.FINALISATION} />
        </FormTestWrapper>
      );

      const addressInput = screen.getByLabelText(
        "Adresse principale de la structure"
      );
      expect(addressInput).toBeInTheDocument();
      expect(addressInput).toHaveValue(testAddress);
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
});
