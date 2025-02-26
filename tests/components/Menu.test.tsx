import { expect, it, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import { Menu } from "@/app/components/Menu";

describe("Menu", () => {
  it("should show header elements when rendered", () => {
    // WHEN
    render(<Menu />);

    // THEN
    const centres = screen.getByRole("link", { name: "Centres" });
    expect(centres).toHaveAttribute("href", "/centres");
    expect(centres).toBeInTheDocument();
    const operateurs = screen.getByRole("link", { name: "Opérateurs" });
    expect(operateurs).toHaveAttribute("href", "/operateurs");
    expect(operateurs).toBeInTheDocument();
    const statistiques = screen.getByRole("link", { name: "Statistiques" });
    expect(statistiques).toHaveAttribute("href", "/statistiques");
    expect(statistiques).toBeInTheDocument();
  });
});
