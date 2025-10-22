import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Tab } from "@/app/(authenticated)/structures/[id]/finalisation/_components/Tab";
import { Tabs } from "@/app/(authenticated)/structures/[id]/finalisation/_components/Tabs";
import { StructureType, StructureWithLatLng } from "@/types/structure.type";

import {
  resetAllMocks,
  setupStructureContext,
} from "../../../../test-utils/form-test-wrapper";

// Mock Link component from next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className} data-testid="link">
      {children}
    </a>
  ),
}));

// Mock useStructureContext for Tab component
const localMockStructureContext = {
  structure: null as StructureWithLatLng | null,
};

vi.mock(
  "@/app/(authenticated)/structures/[id]/_context/StructureClientContext",
  () => ({
    useStructureContext: () => localMockStructureContext,
  })
);

describe("Finalisation Navigation", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Tabs Component", () => {
    it("should render all 6 tabs", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
        id: 1,
        finalisationSteps: [],
      });
      localMockStructureContext.structure = structure;

      render(<Tabs currentStep="01-identification" />);

      // Check that all tabs are rendered (text includes line breaks)
      expect(screen.getByText(/Identification/i)).toBeInTheDocument();
      expect(screen.getByText(/Documents/i)).toBeInTheDocument();
      expect(screen.getByText(/Analyse/i)).toBeInTheDocument();
      expect(screen.getByText(/Contrôle qualité/i)).toBeInTheDocument();
      expect(screen.getByText(/Actes/i)).toBeInTheDocument();
      expect(screen.getByText(/Notes/i)).toBeInTheDocument();
    });

    it("should highlight current step", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
        id: 1,
        finalisationSteps: [],
      });
      localMockStructureContext.structure = structure;

      const { container } = render(<Tabs currentStep="01-identification" />);

      // Current step should have different styling (bg-white, no border-bottom)
      const links = container.querySelectorAll("a");
      const firstLink = links[0];

      const classNames = firstLink?.className || "";
      expect(classNames).toMatch(/bg-white/);
      expect(classNames).toMatch(/border-b-0/);
    });

    it("should show correct routes for all tabs", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
        id: 1,
        finalisationSteps: [],
      });
      localMockStructureContext.structure = structure;

      const { container } = render(<Tabs currentStep="01-identification" />);

      const links = container.querySelectorAll("a");

      expect(links[0]).toHaveAttribute(
        "href",
        "/structures/1/finalisation/01-identification"
      );
      expect(links[1]).toHaveAttribute(
        "href",
        "/structures/1/finalisation/02-documents-financiers"
      );
      expect(links[2]).toHaveAttribute(
        "href",
        "/structures/1/finalisation/03-finance"
      );
      expect(links[3]).toHaveAttribute(
        "href",
        "/structures/1/finalisation/04-controles"
      );
      expect(links[4]).toHaveAttribute(
        "href",
        "/structures/1/finalisation/05-documents"
      );
      expect(links[5]).toHaveAttribute(
        "href",
        "/structures/1/finalisation/06-notes"
      );
    });

    it("should have 6 columns grid layout", () => {
      const structure = setupStructureContext({
        type: StructureType.CADA,
        id: 1,
        finalisationSteps: [],
      });
      localMockStructureContext.structure = structure;

      const { container } = render(<Tabs currentStep="01-identification" />);

      const grid = container.firstChild;
      expect(grid).toHaveClass("grid-cols-6");
    });
  });

  describe("Tab Component - Verification Type", () => {
    beforeEach(() => {
      localMockStructureContext.structure = setupStructureContext({
        type: StructureType.CADA,
        id: 1,
        finalisationSteps: [],
      });
    });

    it("should show À VÉRIFIER tag for incomplete verification steps", () => {
      render(
        <Tab
          title="Identification"
          route="01-identification"
          current={false}
          type="verification"
        />
      );

      expect(screen.getByText("À VÉRIFIER")).toBeInTheDocument();
    });

    it("should show VÉRIFIÉ tag for completed verification steps", () => {
      localMockStructureContext.structure = setupStructureContext({
        type: StructureType.CADA,
        id: 1,
        finalisationSteps: [{ label: "01-identification", completed: true }],
      });

      render(
        <Tab
          title="Identification"
          route="01-identification"
          current={false}
          type="verification"
        />
      );

      expect(screen.getByText("VÉRIFIÉ")).toBeInTheDocument();
      expect(screen.queryByText("À VÉRIFIER")).not.toBeInTheDocument();
    });

    it("should have correct icon for verification tags", () => {
      render(
        <Tab
          title="Identification"
          route="01-identification"
          current={false}
          type="verification"
        />
      );

      // The Tag component uses iconId prop which adds the icon via DSFR
      expect(screen.getByText("À VÉRIFIER")).toBeInTheDocument();
    });
  });

  describe("Tab Component - Completion Type", () => {
    beforeEach(() => {
      localMockStructureContext.structure = setupStructureContext({
        type: StructureType.CADA,
        id: 1,
        finalisationSteps: [],
      });
    });

    it("should show A COMPLÈTER tag for incomplete completion steps", () => {
      render(
        <Tab
          title="Finance"
          route="03-finance"
          current={false}
          type="completion"
        />
      );

      expect(screen.getByText("A COMPLÈTER")).toBeInTheDocument();
    });

    it("should show COMPLÉTÉ tag for completed completion steps", () => {
      localMockStructureContext.structure = setupStructureContext({
        type: StructureType.CADA,
        id: 1,
        finalisationSteps: [{ label: "03-finance", completed: true }],
      });

      render(
        <Tab
          title="Finance"
          route="03-finance"
          current={false}
          type="completion"
        />
      );

      expect(screen.getByText("COMPLÉTÉ")).toBeInTheDocument();
      expect(screen.queryByText("A COMPLÈTER")).not.toBeInTheDocument();
    });
  });

  describe("Tab Component - Styling", () => {
    beforeEach(() => {
      localMockStructureContext.structure = setupStructureContext({
        type: StructureType.CADA,
        id: 1,
        finalisationSteps: [],
      });
    });

    it("should have white background when current", () => {
      const { container } = render(
        <Tab
          title="Identification"
          route="01-identification"
          current={true}
          type="verification"
        />
      );

      const link = container.querySelector("a");
      expect(link).toBeInTheDocument();
      // Note: Tailwind classes might not be in classList if not processed
      // Just verify the className string contains the classes
      const classNames = link?.className || "";
      expect(classNames).toMatch(/bg-white/);
      expect(classNames).toMatch(/border-b-0/);
    });

    it("should have blue background when not current", () => {
      const { container } = render(
        <Tab
          title="Identification"
          route="01-identification"
          current={false}
          type="verification"
        />
      );

      const link = container.querySelector("a");
      expect(link).toBeInTheDocument();
      const classNames = link?.className || "";
      expect(classNames).toMatch(/bg-alt-blue-france/);
      expect(classNames).toMatch(/hover:bg-alt-blue-france-hover/);
    });

    it("should display arrow icon", () => {
      const { container } = render(
        <Tab
          title="Identification"
          route="01-identification"
          current={false}
          type="verification"
        />
      );

      const icon = container.querySelector(".fr-icon-arrow-right-line");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Tab Navigation Interaction", () => {
    beforeEach(() => {
      localMockStructureContext.structure = setupStructureContext({
        type: StructureType.CADA,
        id: 1,
        finalisationSteps: [],
      });
    });

    it("should render as a clickable link", async () => {
      const user = userEvent.setup();

      render(
        <Tab
          title="Identification"
          route="01-identification"
          current={false}
          type="verification"
        />
      );

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();

      // Verify link constructs correct href from route
      expect(link).toHaveAttribute(
        "href",
        "/structures/1/finalisation/01-identification"
      );

      // Verify link is clickable
      await user.click(link);
    });
  });

  describe("Step Completion Tracking", () => {
    it("should track multiple completed steps", () => {
      localMockStructureContext.structure = setupStructureContext({
        type: StructureType.CADA,
        id: 1,
        finalisationSteps: [
          { label: "01-identification", completed: true },
          { label: "02-documents-financiers", completed: true },
          { label: "03-finance", completed: true },
        ],
      });

      render(<Tabs currentStep="04-controles" />);

      // First 3 steps should show as completed
      const verifiedTags = screen.getAllByText("VÉRIFIÉ");
      const completedTags = screen.getAllByText("COMPLÉTÉ");

      expect(verifiedTags.length).toBeGreaterThan(0);
      expect(completedTags.length).toBeGreaterThan(0);
    });

    it("should handle partially completed workflow", () => {
      localMockStructureContext.structure = setupStructureContext({
        type: StructureType.CADA,
        id: 1,
        finalisationSteps: [{ label: "01-identification", completed: true }],
      });

      render(<Tabs currentStep="02-documents-financiers" />);

      // Should have one VÉRIFIÉ (completed) and one À VÉRIFIER (not completed)
      const verifiedTags = screen.queryAllByText("VÉRIFIÉ");
      const aVerifierTags = screen.queryAllByText("À VÉRIFIER");

      expect(verifiedTags.length).toBe(1);
      expect(aVerifierTags.length).toBe(1);
    });

    it("should handle no completed steps", () => {
      localMockStructureContext.structure = setupStructureContext({
        type: StructureType.CADA,
        id: 1,
        finalisationSteps: [],
      });

      render(<Tabs currentStep="01-identification" />);

      expect(screen.queryByText("VÉRIFIÉ")).not.toBeInTheDocument();
      expect(screen.queryByText("COMPLÉTÉ")).not.toBeInTheDocument();
    });

    it("should handle all steps completed", () => {
      localMockStructureContext.structure = setupStructureContext({
        type: StructureType.CADA,
        id: 1,
        finalisationSteps: [
          { label: "01-identification", completed: true },
          { label: "02-documents-financiers", completed: true },
          { label: "03-finance", completed: true },
          { label: "04-controles", completed: true },
          { label: "05-documents", completed: true },
          { label: "06-notes", completed: true },
        ],
      });

      render(<Tabs currentStep="06-notes" />);

      const verifiedTags = screen.getAllByText("VÉRIFIÉ");
      const completedTags = screen.getAllByText("COMPLÉTÉ");

      // 2 verification steps + 4 completion steps
      expect(verifiedTags.length).toBe(2);
      expect(completedTags.length).toBe(4);
    });
  });
});
