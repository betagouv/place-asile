import { describe, expect, it } from "vitest";

import { normalizeAccents } from "@/app/utils/string.util";

describe("string util", () => {
  describe("normalizeAccents", () => {
    it("supprime les accents et met en minuscule", () => {
      expect(normalizeAccents("Éléphant")).toBe("elephant");
      expect(normalizeAccents("àéîõü")).toBe("aeiou");
      expect(normalizeAccents("ÇA MARCHE")).toBe("ca marche");
      expect(normalizeAccents("Crème brûlée")).toBe("creme brulee");
      expect(normalizeAccents("façade")).toBe("facade");
    });

    it("gère les chaînes sans accents", () => {
      expect(normalizeAccents("Hello World")).toBe("hello world");
      expect(normalizeAccents("test123")).toBe("test123");
    });

    it("gère les chaînes vides", () => {
      expect(normalizeAccents("")).toBe("");
    });

    it("gère les caractères spéciaux non accentués", () => {
      expect(normalizeAccents("déjà-vu!")).toBe("deja-vu!");
      expect(normalizeAccents("mañana@2024")).toBe("manana@2024");
    });

    it("gère les caractères accentués mélangés à des caractères non accentués", () => {
      expect(normalizeAccents("Joël & Zoë")).toBe("joel & zoe");
    });
  });
});
