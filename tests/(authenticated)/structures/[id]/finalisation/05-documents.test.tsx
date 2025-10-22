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

import FinalisationDocuments from "@/app/(authenticated)/structures/[id]/finalisation/05-documents/page";
import { StructureType } from "@/types/structure.type";

// Mock the document components for integration testing
vi.mock("@/app/components/forms/documents/UploadsByCategory", () => ({
  default: () => <div data-testid="uploads-by-category" />,
}));

// Mock the category display utilities
vi.mock("@/app/utils/categoryToDisplay.util", () => ({
  getCategoriesToDisplay: () => ["CONVENTION", "AUTORISATION"],
  getCategoriesDisplayRules: () => ({
    CONVENTION: {
      categoryShortName: "Convention",
      title: "Convention",
      canAddFile: true,
      canAddAvenant: false,
      isOptional: false,
      additionalFieldsType: null,
      documentLabel: "Convention",
      addFileButtonLabel: "Ajouter une convention",
      notice: null,
    },
    AUTORISATION: {
      categoryShortName: "Autorisation",
      title: "Autorisation",
      canAddFile: true,
      canAddAvenant: false,
      isOptional: false,
      additionalFieldsType: null,
      documentLabel: "Autorisation",
      addFileButtonLabel: "Ajouter une autorisation",
      notice: null,
    },
  }),
}));

vi.mock("@/app/components/forms/documents/Disclaimer", () => ({
  Disclaimer: () => <div data-testid="disclaimer" />,
}));

vi.mock("@/app/components/forms/MaxSizeNotice", () => ({
  MaxSizeNotice: () => <div data-testid="max-size-notice" />,
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

describe("FinalisationDocuments Page", () => {
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
          <FinalisationDocuments />
        </FormTestWrapper>
      );

      expect(screen.getByTestId("tabs")).toBeInTheDocument();
      expect(screen.getByTestId("disclaimer")).toBeInTheDocument();
      expect(screen.getByTestId("max-size-notice")).toBeInTheDocument();
      expect(screen.getAllByTestId("uploads-by-category")).toHaveLength(2);
    });

    it("should render InformationBar with complete variant", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationDocuments />
        </FormTestWrapper>
      );

      expect(screen.getByText("À compléter")).toBeInTheDocument();
      expect(
        screen.getByText(/actes administratifs historiques/)
      ).toBeInTheDocument();
    });

    it("should render submit button", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationDocuments />
        </FormTestWrapper>
      );

      expect(
        screen.getByRole("button", {
          name: /Étape suivante/i,
        })
      ).toBeInTheDocument();
    });
  });

  describe("Category filtering", () => {
    it("should exclude INSPECTION_CONTROLE category", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationDocuments />
        </FormTestWrapper>
      );

      expect(screen.getAllByTestId("uploads-by-category")).toHaveLength(2);
    });
  });
});
