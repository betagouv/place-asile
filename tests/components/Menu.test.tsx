import { expect, it, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import { Menu } from "@/app/components/Menu";

describe("Menu", () => {
  it("should show header elements when rendered", () => {
    // WHEN
    render(<Menu />);

    // THEN
    const structures = screen.getByRole("link", {
      name: "Structures d’hébergement",
    });
    expect(structures).toHaveAttribute("href", "/structures");
    expect(structures).toBeInTheDocument();
    const operateurs = screen.getByRole("link", { name: "Opérateurs" });
    expect(operateurs).toHaveAttribute("href", "/operateurs");
    expect(operateurs).toBeInTheDocument();
    const statistiques = screen.getByRole("link", { name: "Statistiques" });
    expect(statistiques).toHaveAttribute("href", "/statistiques");
    expect(statistiques).toBeInTheDocument();
    const confidentialite = screen.getByRole("link", {
      name: "Politique de confidentialité",
    });
    expect(confidentialite).toHaveAttribute("href", "/confidentialite");
    expect(confidentialite).toBeInTheDocument();
    const accessibilite = screen.getByRole("link", {
      name: "Accessibilité : partiellement conforme",
    });
    expect(accessibilite).toHaveAttribute("href", "/accessibilite");
    expect(accessibilite).toBeInTheDocument();
    const codeSource = screen.getByRole("link", { name: "Code source" });
    expect(codeSource).toHaveAttribute(
      "href",
      "https://github.com/betagouv/place-asile"
    );
    expect(codeSource).toHaveAttribute("target", "_blank");
    expect(codeSource).toHaveAttribute("rel", "noopener external");
    expect(codeSource).toBeInTheDocument();
  });
});
