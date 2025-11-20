import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { StructuresTableHeadings } from "@/app/(authenticated)/structures/_components/StructuresTableHeadings";

const mockPush = vi.fn();
const mockReplace = vi.fn();

const mockUseSearchParams = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useSearchParams: () => mockUseSearchParams(),
}));

describe("StructuresTableHeadings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize column and direction from URL params", () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("column=dnaCode&direction=asc")
    );

    render(
      <StructuresTableHeadings ariaLabelledBy="test">
        {[
          <tr key="test">
            <td>Test</td>
          </tr>,
        ]}
      </StructuresTableHeadings>
    );

    const dnaButton = screen.getByLabelText("Ordonner par dnaCode");
    expect(dnaButton).toBeInTheDocument();
  });

  it("should update URL when ordering is clicked", async () => {
    const user = userEvent.setup();
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    render(
      <StructuresTableHeadings ariaLabelledBy="test">
        {[
          <tr key="test">
            <td>Test</td>
          </tr>,
        ]}
      </StructuresTableHeadings>
    );

    const typeButton = screen.getByLabelText("Ordonner par type");
    await user.click(typeButton);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining("column=type&direction=asc")
      );
    });
  });

  it("should toggle direction from asc to desc when clicking same column", async () => {
    const user = userEvent.setup();
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("column=dnaCode&direction=asc")
    );

    render(
      <StructuresTableHeadings ariaLabelledBy="test">
        {[
          <tr key="test">
            <td>Test</td>
          </tr>,
        ]}
      </StructuresTableHeadings>
    );

    const dnaButton = screen.getByLabelText("Ordonner par dnaCode");
    await user.click(dnaButton);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining("column=dnaCode&direction=desc")
      );
    });
  });

  it("should clear ordering when clicking same column in desc direction", async () => {
    const user = userEvent.setup();
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("column=dnaCode&direction=desc")
    );

    // Clear any initial calls from render
    vi.clearAllMocks();

    render(
      <StructuresTableHeadings ariaLabelledBy="test">
        {[
          <tr key="test">
            <td>Test</td>
          </tr>,
        ]}
      </StructuresTableHeadings>
    );

    // Wait for initial render effects
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled();
    });

    // Clear calls from initial render
    mockReplace.mockClear();

    const dnaButton = screen.getByLabelText("Ordonner par dnaCode");
    await user.click(dnaButton);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled();
      const callArgs =
        mockReplace.mock.calls[mockReplace.mock.calls.length - 1][0];
      expect(callArgs).not.toContain("column=dnaCode");
      expect(callArgs).not.toContain("direction=");
    });
  });

  it("should set new column to asc when clicking different column", async () => {
    const user = userEvent.setup();
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("column=dnaCode&direction=asc")
    );

    render(
      <StructuresTableHeadings ariaLabelledBy="test">
        {[
          <tr key="test">
            <td>Test</td>
          </tr>,
        ]}
      </StructuresTableHeadings>
    );

    const typeButton = screen.getByLabelText("Ordonner par type");
    await user.click(typeButton);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining("column=type&direction=asc")
      );
    });
  });
});
