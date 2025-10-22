/* eslint-disable simple-import-sort/imports */
// Mocks must be imported BEFORE the components being tested for Vitest to work correctly
import {
  FormTestWrapper,
  mockStructureContext,
  mockUpdateAndRefreshStructure,
  resetAllMocks,
  setupStructureContext,
} from "../../../../test-utils/form-test-wrapper";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import FinalisationIdentification from "@/app/(authenticated)/structures/[id]/finalisation/01-identification/page";
import { StructureType } from "@/types/structure.type";

// Mock the FieldSet components for integration testing
vi.mock(
  "@/app/components/forms/fieldsets/structure/FieldSetDescription",
  () => ({
    FieldSetDescription: () => <div data-testid="fieldset-description" />,
  })
);

vi.mock("@/app/components/forms/fieldsets/structure/FieldSetContacts", () => ({
  FieldSetContacts: () => <div data-testid="fieldset-contacts" />,
}));

vi.mock(
  "@/app/components/forms/fieldsets/structure/FieldSetCalendrier",
  () => ({
    FieldSetCalendrier: () => <div data-testid="fieldset-calendrier" />,
  })
);

vi.mock(
  "@/app/components/forms/fieldsets/structure/FieldSetAdresseAdministrative",
  () => ({
    FieldSetAdresseAdministrative: () => <div data-testid="fieldset-adresse" />,
  })
);

vi.mock(
  "@/app/components/forms/fieldsets/structure/FieldSetTypePlaces",
  () => ({
    FieldSetTypePlaces: () => <div data-testid="fieldset-type-places" />,
  })
);

// Mock Tabs component
vi.mock(
  "@/app/(authenticated)/structures/[id]/finalisation/_components/Tabs",
  () => ({
    Tabs: () => <div data-testid="tabs" />,
  })
);

// Mock AutoSave component
vi.mock("@/app/components/forms/AutoSave", () => ({
  AutoSave: () => null,
}));

describe("FinalisationIdentification Page", () => {
  beforeEach(() => {
    resetAllMocks();
    mockUpdateAndRefreshStructure.mockResolvedValue("OK");
  });

  describe("Rendering", () => {
    it("should render all FieldSet components", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationIdentification />
        </FormTestWrapper>
      );

      expect(screen.getByTestId("tabs")).toBeInTheDocument();
      expect(screen.getByTestId("fieldset-description")).toBeInTheDocument();
      expect(screen.getByTestId("fieldset-contacts")).toBeInTheDocument();
      expect(screen.getByTestId("fieldset-calendrier")).toBeInTheDocument();
      expect(screen.getByTestId("fieldset-adresse")).toBeInTheDocument();
      expect(screen.getByTestId("fieldset-type-places")).toBeInTheDocument();
    });

    it("should render InformationBar with verify variant", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationIdentification />
        </FormTestWrapper>
      );

      expect(screen.getByText("À vérifier")).toBeInTheDocument();
      expect(
        screen.getByText(/Veuillez vérifier les informations suivantes/)
      ).toBeInTheDocument();
    });

    it("should render submit button", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationIdentification />
        </FormTestWrapper>
      );

      expect(
        screen.getByRole("button", {
          name: /Je valide la saisie de cette page/i,
        })
      ).toBeInTheDocument();
    });
  });

  describe("Form submission", () => {
    it("should call handleValidation on form submit", async () => {
      const user = userEvent.setup();
      const structure = setupStructureContext({
        type: StructureType.CADA,
        finalisationSteps: [],
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationIdentification />
        </FormTestWrapper>
      );

      const submitButton = screen.getByRole("button", {
        name: /Je valide la saisie de cette page/i,
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateAndRefreshStructure).toHaveBeenCalled();
      });
    });

    it("should update finalisationSteps on validation", async () => {
      const user = userEvent.setup();
      const structure = setupStructureContext({
        type: StructureType.CADA,
        finalisationSteps: [],
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationIdentification />
        </FormTestWrapper>
      );

      const submitButton = screen.getByRole("button", {
        name: /Je valide la saisie de cette page/i,
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateAndRefreshStructure).toHaveBeenCalledWith(
          structure.id,
          expect.objectContaining({
            finalisationSteps: expect.arrayContaining([
              expect.objectContaining({
                label: "01-identification",
                completed: true,
              }),
            ]),
          }),
          expect.any(Function)
        );
      });
    });

    it("should not duplicate finalisationSteps if already exists", async () => {
      const user = userEvent.setup();
      const structure = setupStructureContext({
        type: StructureType.CADA,
        finalisationSteps: [
          { label: "01-identification", completed: true },
          { label: "02-documents-financiers", completed: false },
        ],
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationIdentification />
        </FormTestWrapper>
      );

      const submitButton = screen.getByRole("button", {
        name: /Je valide la saisie de cette page/i,
      });

      await user.click(submitButton);

      await waitFor(() => {
        const call = mockUpdateAndRefreshStructure.mock.calls[0];
        const finalisationSteps = call?.[1]?.finalisationSteps;

        expect(finalisationSteps).toHaveLength(2);
        expect(finalisationSteps).toEqual([
          { label: "02-documents-financiers", completed: false },
          { label: "01-identification", completed: true },
        ]);
      });
    });
  });

  describe("Form submission behavior", () => {
    it("should call handleValidation with finalisationSteps when form is submitted", async () => {
      const user = userEvent.setup();
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper
          structure={structure}
          defaultValues={{
            nom: "Test Structure",
          }}
        >
          <FinalisationIdentification />
        </FormTestWrapper>
      );

      const submitButton = screen.getByRole("button", {
        name: /Je valide la saisie de cette page/i,
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateAndRefreshStructure).toHaveBeenCalledWith(
          structure.id,
          expect.objectContaining({
            finalisationSteps: expect.arrayContaining([
              expect.objectContaining({
                label: "01-identification",
                completed: true,
              }),
            ]),
          }),
          expect.any(Function)
        );
      });
    });
  });
});
