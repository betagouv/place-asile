import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Filters } from "@/app/(authenticated)/structures/_components/Filters";

const mockUseSearchParams = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

describe("Filters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should show active indicator when filters are applied", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("type=CADA&bati=DIFFUS")
    );

    render(<Filters />);

    const filterButton = screen.getByText("Filtres");
    const indicator = filterButton.querySelector(
      ".bg-border-action-high-warning"
    );
    expect(indicator).toBeInTheDocument();
  });

  it("should show active indicator when places filter is applied", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("places=10"));

    render(<Filters />);

    const filterButton = screen.getByText("Filtres");
    const indicator = filterButton.querySelector(
      ".bg-border-action-high-warning"
    );
    expect(indicator).toBeInTheDocument();
  });

  it("should show active indicator when location filters are applied", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("departements=75,92")
    );

    render(<Filters />);

    const locationButton = screen.getByText("Région / Département");
    const indicator = locationButton.querySelector(
      ".bg-border-action-high-warning"
    );
    expect(indicator).toBeInTheDocument();
  });

  it("should not show active indicator when no filters are applied", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    render(<Filters />);

    const filterButton = screen.getByText("Filtres");
    const indicator = filterButton.querySelector(
      ".bg-border-action-high-warning"
    );
    expect(indicator).not.toBeInTheDocument();

    const locationButton = screen.getByText("Région / Département");
    const locationIndicator = locationButton.querySelector(
      ".bg-border-action-high-warning"
    );
    expect(locationIndicator).not.toBeInTheDocument();
  });
});
