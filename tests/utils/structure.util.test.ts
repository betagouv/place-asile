import {
  getPlacesByCommunes,
  getRepartition,
} from "@/app/utils/structure.util";
import { Adresse, Repartition } from "../../src/types/adresse.type";
import { createAdresse } from "../test-utils/adresse.factory";
import { createTypologie } from "../test-utils/typologie.factory";
import { createStructure } from "../test-utils/structure.factory";

describe("structure util", () => {
  describe("getPlacesByCommunes", () => {
    it("should return an empty object when given an empty array", () => {
      // GIVEN
      const adresses: Adresse[] = [];

      // WHEN
      const placesByCommune = getPlacesByCommunes(adresses);

      // THEN
      expect(placesByCommune).toStrictEqual({});
    });
    it("should return correct places by commune when given a adresses array", () => {
      // GIVEN
      const typologie1 = createTypologie({ adresseId: 1, nbPlacesTotal: 2 });
      const typologie2 = createTypologie({ adresseId: 2, nbPlacesTotal: 3 });
      const typologie3 = createTypologie({ adresseId: 3, nbPlacesTotal: 1 });
      const typologie4 = createTypologie({ adresseId: 4, nbPlacesTotal: 1 });

      const adresses: Adresse[] = [
        createAdresse({ id: 1, commune: "Paris", typologies: [typologie1] }),
        createAdresse({ id: 2, commune: "Paris", typologies: [typologie2] }),
        createAdresse({ id: 3, commune: "Rouen", typologies: [typologie3] }),
        createAdresse({ id: 4, commune: "Rouen", typologies: [typologie4] }),
      ];

      // WHEN
      const placesByCommune = getPlacesByCommunes(adresses);

      // THEN
      expect(placesByCommune).toStrictEqual({ Paris: 5, Rouen: 2 });
    });
  });

  describe("getRepartition", () => {
    it("should return Collectif when given no adresses", () => {
      // GIVEN
      const structure = createStructure({ adresses: [] });

      // WHEN
      const repartition = getRepartition(structure);

      // THEN
      expect(repartition).toBe(Repartition.COLLECTIF);
    });
    it("should return Collectif when given adresses with only collectif", () => {
      // GIVEN
      const adresses = [
        createAdresse({ repartition: Repartition.COLLECTIF }),
        createAdresse({ repartition: Repartition.COLLECTIF }),
      ];
      const structure = createStructure({ adresses });

      // WHEN
      const repartition = getRepartition(structure);

      // THEN
      expect(repartition).toBe(Repartition.COLLECTIF);
    });
    it("should return Diffus when given adresses with only diffus", () => {
      // GIVEN
      const adresses = [
        createAdresse({ repartition: Repartition.DIFFUS }),
        createAdresse({ repartition: Repartition.DIFFUS }),
      ];
      const structure = createStructure({ adresses });

      // WHEN
      const repartition = getRepartition(structure);

      // THEN
      expect(repartition).toBe(Repartition.DIFFUS);
    });
    it("should return Mixte when given adresses with diffus and collectif", () => {
      const adresses = [
        createAdresse({ repartition: Repartition.COLLECTIF }),
        createAdresse({ repartition: Repartition.DIFFUS }),
      ];
      const structure = createStructure({ adresses });

      // WHEN
      const repartition = getRepartition(structure);

      // THEN
      expect(repartition).toBe(Repartition.MIXTE);
    });
  });
});
