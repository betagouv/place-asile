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

import FinalisationDocumentsFinanciers from "@/app/(authenticated)/structures/[id]/finalisation/02-documents-financiers/page";
import { StructureType } from "@/types/structure.type";

// Mock the Documents component for integration testing
vi.mock("@/app/components/forms/finance/documents/Documents", () => ({
  Documents: () => <div data-testid="documents" />,
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

describe("FinalisationDocumentsFinanciers Page", () => {
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
          <FinalisationDocumentsFinanciers />
        </FormTestWrapper>
      );

      expect(screen.getByTestId("tabs")).toBeInTheDocument();
      expect(screen.getByTestId("documents")).toBeInTheDocument();
    });

    it("should render InformationBar with verify variant", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationDocumentsFinanciers />
        </FormTestWrapper>
      );

      expect(screen.getByText("À vérifier")).toBeInTheDocument();
      expect(screen.getByText(/documents financiers/)).toBeInTheDocument();
    });

    it("should render submit button", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
      });
      mockStructureContext.structure = structure;

      render(
        <FormTestWrapper>
          <FinalisationDocumentsFinanciers />
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
          <FinalisationDocumentsFinanciers />
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
          <FinalisationDocumentsFinanciers />
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
                label: "02-documents-financiers",
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
          <FinalisationDocumentsFinanciers />
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
          { label: "01-identification", completed: true },
          { label: "02-documents-financiers", completed: true },
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
            fileUploads: [
              { key: "file1", name: "document1.pdf" },
              { key: "file2", name: "document2.pdf" },
            ],
          }}
        >
          <FinalisationDocumentsFinanciers />
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
                label: "02-documents-financiers",
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
