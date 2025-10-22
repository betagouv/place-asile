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

import FinalisationControles from "@/app/(authenticated)/structures/[id]/finalisation/04-controles/page";
import { StructureType } from "@/types/structure.type";

// Mock the UploadsByCategory component for integration testing
vi.mock("@/app/components/forms/documents/UploadsByCategory", () => ({
  default: () => <div data-testid="uploads-by-category" />,
}));

// Mock Tabs component
vi.mock(
  "@/app/(authenticated)/structures/[id]/finalisation/_components/Tabs",
  () => ({
    Tabs: () => <div data-testid="tabs" />,
  })
);

// Mock Notice component
vi.mock("@codegouvfr/react-dsfr/Notice", () => ({
  default: ({ description }: { description: string }) => (
    <div data-testid="notice">{description}</div>
  ),
}));

describe("FinalisationControles Page", () => {
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
          <FinalisationControles />
        </FormTestWrapper>
      );

      expect(screen.getByTestId("tabs")).toBeInTheDocument();
      expect(screen.getByTestId("uploads-by-category")).toBeInTheDocument();
      expect(screen.getByTestId("notice")).toBeInTheDocument();
    });

    it("should render InformationBar with complete variant", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationControles />
        </FormTestWrapper>
      );

      expect(screen.getByText("À compléter")).toBeInTheDocument();
      expect(
        screen.getByText(/évaluations et inspections-contrôles/)
      ).toBeInTheDocument();
    });

    it("should render DNA notice", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationControles />
        </FormTestWrapper>
      );

      expect(
        screen.getByText(
          /Les Évaluations et les Évènements Indésirables Graves sont renseignés à partir du DNA/
        )
      ).toBeInTheDocument();
    });

    it("should render submit button", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationControles />
        </FormTestWrapper>
      );

      expect(
        screen.getByRole("button", {
          name: /Valider/i,
        })
      ).toBeInTheDocument();
    });
  });
});
