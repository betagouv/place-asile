import { expect, it, describe, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { Menu } from "@/app/components/Menu";
import client from "next-auth/react";

vitest.mock("next-auth/react");

describe("Menu", () => {
  it("should show header elements when rendered", () => {
    // GIVEN
    const mockSession = {
      expires: "1",
      user: { email: "test@example.com", name: "John Doe" },
    };

    (client.useSession as Mock).mockReturnValueOnce([mockSession, false]);

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
    expect(aide).toHaveAttribute("href", "mailto:placedasile@beta.gouv.fr");
    expect(aide).toHaveAttribute("target", "_blank");
    expect(aide).toHaveAttribute("rel", "noopener external");
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
