import { describe, expect, it } from "vitest";

import { formatCityName } from "@/app/utils/adresse.util";

describe("adresse util", () => {
  describe("formatCityName", () => {
    it("formats names correctly with hyphens", () => {
      expect(formatCityName("Gamaches en Vexin")).toBe("Gamaches-en-Vexin");
      expect(formatCityName("Ivry la Bataille")).toBe("Ivry-la-Bataille");
      expect(formatCityName("Neuilly sur Seine")).toBe("Neuilly-sur-Seine");
    });

    it("handles articles at the beginning without hyphen", () => {
      expect(formatCityName("Les Andelys")).toBe("Les Andelys");
      expect(formatCityName("Le Grau du Roi")).toBe("Le Grau-du-Roi");
      expect(formatCityName("La Rochelle")).toBe("La Rochelle");
    });

    it("lowercases prepositions and inside articles", () => {
      expect(formatCityName("Neuilly Sur Seine")).toBe("Neuilly-sur-Seine");
      expect(formatCityName("Le Grau du Roi")).toBe("Le Grau-du-Roi");
      expect(formatCityName("Ville sous Bois")).toBe("Ville-sous-Bois");
      expect(formatCityName("Ivry La Bataille")).toBe("Ivry-la-Bataille");
    });

    it("capitalizes all other words correctly", () => {
      expect(formatCityName("PARIS")).toBe("Paris");
      expect(formatCityName("lyon")).toBe("Lyon");
      expect(formatCityName("mArSeIlLe")).toBe("Marseille");
    });

    it("handles multiple spaces", () => {
      expect(formatCityName("  Les   Andelys  ")).toBe("Les Andelys");
    });

    it("handles empty strings and null", () => {
      expect(formatCityName("")).toBe(null);
      expect(formatCityName("   ")).toBe(null);
      expect(formatCityName("")).toBe(null);
    });

    it("handles names with apostrophe", () => {
      expect(formatCityName("L'Isle d'abeau")).toBe("L'Isle-d'Abeau");
    });
  });
});
