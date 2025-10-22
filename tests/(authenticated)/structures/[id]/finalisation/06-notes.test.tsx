/* eslint-disable simple-import-sort/imports */
// Mocks must be imported BEFORE the components being tested for Vitest to work correctly
import {
  FormTestWrapper,
  mockStructureContext,
  mockUpdateAndRefreshStructure,
  resetAllMocks,
  setupStructureContext,
} from "../../../../test-utils/form-test-wrapper";

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import FinalisationNotes from "@/app/(authenticated)/structures/[id]/finalisation/06-notes/page";
import { StructureType } from "@/types/structure.type";

// Mock the notes components for integration testing
vi.mock("@/app/components/forms/fieldsets/structure/FieldSetNotes", () => ({
  FieldSetNotes: () => <div data-testid="fieldset-notes" />,
}));

vi.mock("@/app/components/forms/notes/NoteDisclaimer", () => ({
  NoteDisclaimer: () => <div data-testid="note-disclaimer" />,
}));

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

describe("FinalisationNotes Page", () => {
  beforeEach(() => {
    resetAllMocks();
    mockUpdateAndRefreshStructure.mockResolvedValue("OK");
  });

  describe("Rendering", () => {
    it("should render all components", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationNotes />
        </FormTestWrapper>
      );

      expect(screen.getByTestId("tabs")).toBeInTheDocument();
      expect(screen.getByTestId("fieldset-notes")).toBeInTheDocument();
      expect(screen.getByTestId("note-disclaimer")).toBeInTheDocument();
    });

    it("should render InformationBar with complete variant", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationNotes />
        </FormTestWrapper>
      );

      expect(screen.getByText("À compléter")).toBeInTheDocument();
      expect(
        screen.getByText(/centraliser et annoter les informations/)
      ).toBeInTheDocument();
    });

    it("should render submit button", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationNotes />
        </FormTestWrapper>
      );

      expect(
        screen.getByRole("button", {
          name: /Je valide la saisie de cette page/i,
        })
      ).toBeInTheDocument();
    });
  });
});
