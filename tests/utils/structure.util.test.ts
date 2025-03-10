import { getPlacesByCommunes } from "@/app/utils/structure.util";
import { Logement } from "../../src/types/logement.type";
import { createLogement } from "../test-utils/logement.factory";

describe("structure util", () => {
  describe("getPlacesByCommunes", () => {
    it("should return an empty object when given an empty array", () => {
      // GIVEN
      const logements: Logement[] = [];

      // WHEN
      const placesByCommune = getPlacesByCommunes(logements);

      // THEN
      expect(placesByCommune).toStrictEqual({});
    });
    it("should return correct places by commune when given a logements array", () => {
      // GIVEN
      const logements: Logement[] = [
        createLogement({ ville: "Paris", nbPlaces: 3 }),
        createLogement({ ville: "Paris", nbPlaces: 2 }),
        createLogement({ ville: "Rouen", nbPlaces: 1 }),
        createLogement({ ville: "Rouen", nbPlaces: 1 }),
      ];

      // WHEN
      const placesByCommune = getPlacesByCommunes(logements);

      // THEN
      expect(placesByCommune).toStrictEqual({ Paris: 5, Rouen: 2 });
    });
  });
});
