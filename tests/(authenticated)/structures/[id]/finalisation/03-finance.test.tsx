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

import FinalisationFinance from "@/app/(authenticated)/structures/[id]/finalisation/03-finance/page";
import { StructureType } from "@/types/structure.type";

// Mock the finance components for integration testing
vi.mock("@/app/components/forms/finance/IndicateursGeneraux", () => ({
  IndicateursGeneraux: () => <div data-testid="indicateurs-generaux" />,
}));

vi.mock("@/app/components/forms/finance/BudgetTables", () => ({
  BudgetTables: () => <div data-testid="budget-tables" />,
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

describe("FinalisationFinance Page", () => {
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
          <FinalisationFinance />
        </FormTestWrapper>
      );

      expect(screen.getByTestId("tabs")).toBeInTheDocument();
      expect(screen.getByTestId("indicateurs-generaux")).toBeInTheDocument();
      expect(screen.getByTestId("budget-tables")).toBeInTheDocument();
    });

    it("should render InformationBar with complete variant", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationFinance />
        </FormTestWrapper>
      );

      expect(screen.getByText("À compléter")).toBeInTheDocument();
      expect(screen.getByText(/champs obligatoires/)).toBeInTheDocument();
    });

    it("should render submit button", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationFinance />
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
