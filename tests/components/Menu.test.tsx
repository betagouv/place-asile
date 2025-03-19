import { expect, it, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import { Menu } from "@/app/components/Menu";

describe("Menu", () => {
  it("should show header elements when rendered", () => {
    // WHEN
    render(<Menu />);

    // THEN
    const logo = screen.getByRole("link", {
      name: "Place d’asile",
    });
    expect(logo).toHaveAttribute("href", "/");
    const structures = screen.getByRole("link", {
      name: "Structures d’hébergement",
    });
    expect(structures).toHaveAttribute("href", "/structures");
    const operateurs = screen.getByRole("link", { name: "Opérateurs" });
    expect(operateurs).toHaveAttribute("href", "/operateurs");
    const statistiques = screen.getByRole("link", { name: "Statistiques" });
    expect(statistiques).toHaveAttribute("href", "/statistiques");
    const aide = screen.getByRole("link", {
      name: "Aide",
    });
    expect(aide).toHaveAttribute("href", "/");
    const confidentialite = screen.getByRole("link", {
      name: "Politique de confidentialité",
    });
    expect(confidentialite).toHaveAttribute("href", "/confidentialite");
    const accessibilite = screen.getByRole("link", {
      name: "Accessibilité : partiellement conforme",
    });
    expect(accessibilite).toHaveAttribute("href", "/accessibilite");
    const codeSource = screen.getByRole("link", { name: "Code source" });
    expect(codeSource).toHaveAttribute(
      "href",
      "https://github.com/betagouv/place-asile"
    );
    expect(codeSource).toHaveAttribute("target", "_blank");
    expect(codeSource).toHaveAttribute("rel", "noopener external");
  });
});
