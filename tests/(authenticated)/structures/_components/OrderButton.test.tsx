import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { OrderButton } from "@/app/(authenticated)/structures/_components/OrderButton";

describe("OrderButton", () => {
  it("should call handleOrdering when clicked", async () => {
    const user = userEvent.setup();
    const handleOrdering = vi.fn();

    render(
      <OrderButton
        column="dnaCode"
        currentColumn={null}
        currentDirection={null}
        handleOrdering={handleOrdering}
      />
    );

    const button = screen.getByLabelText("Ordonner par dnaCode");
    await user.click(button);

    expect(handleOrdering).toHaveBeenCalledWith("dnaCode");
  });

  it("should highlight ascending arrow when column is active and direction is asc", () => {
    render(
      <OrderButton
        column="dnaCode"
        currentColumn="dnaCode"
        currentDirection="asc"
        handleOrdering={vi.fn()}
      />
    );

    const button = screen.getByLabelText("Ordonner par dnaCode");
    const ascendingArrow = button.querySelector(".fr-icon-arrow-up-s-line");
    expect(ascendingArrow).toHaveClass("text-title-blue-france");
  });

  it("should highlight descending arrow when column is active and direction is desc", () => {
    render(
      <OrderButton
        column="type"
        currentColumn="type"
        currentDirection="desc"
        handleOrdering={vi.fn()}
      />
    );

    const button = screen.getByLabelText("Ordonner par type");
    const descendingArrow = button.querySelector(".fr-icon-arrow-down-s-line");
    expect(descendingArrow).toHaveClass("text-title-blue-france");
  });

  it("should not highlight arrows when column is not active", () => {
    render(
      <OrderButton
        column="type"
        currentColumn="dnaCode"
        currentDirection="asc"
        handleOrdering={vi.fn()}
      />
    );

    const button = screen.getByLabelText("Ordonner par type");
    const ascendingArrow = button.querySelector(".fr-icon-arrow-up-s-line");
    const descendingArrow = button.querySelector(".fr-icon-arrow-down-s-line");

    expect(ascendingArrow).not.toHaveClass("text-title-blue-france");
    expect(descendingArrow).not.toHaveClass("text-title-blue-france");
  });
});
