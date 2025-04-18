import {
  getLastVisitInMonths,
  getPlacesByCommunes,
  getRepartition,
} from "@/app/utils/structure.util";
import { Adresse, Repartition } from "../../src/types/adresse.type";
import { createAdresse } from "../test-utils/adresse.factory";
import { createTypologie } from "../test-utils/typologie.factory";
import { createStructure } from "../test-utils/structure.factory";
import { Evaluation } from "@/types/evaluation.type";
import { Controle } from "@/types/controle.type";
import { createEvaluation } from "../test-utils/evaluation.factory";
import dayjs from "dayjs";
import { createControle } from "../test-utils/controle.factory";

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
  describe("getLastVisitInMonths", () => {
    it("should return 0 when both arrays are empty", () => {
      // GIVEN
      const evaluations: Evaluation[] = [];
      const controles: Controle[] = [];

      // WHEN
      const result = getLastVisitInMonths(evaluations, controles);

      // THEN
      expect(result).toBe(0);
    });

    it("should return the difference in months from the most recent evaluation when controles array is empty", () => {
      // GIVEN
      const evaluations: Evaluation[] = [
        createEvaluation({ date: dayjs().subtract(2, "month").toDate() }),
      ];
      const controles: Controle[] = [];

      // WHEN
      const result = getLastVisitInMonths(evaluations, controles);

      // THEN
      expect(result).toBe(2);
    });

    it("should return the difference in months from the most recent controle when evaluations array is empty", () => {
      // GIVEN
      const evaluations: Evaluation[] = [];
      const controles: Controle[] = [
        createControle({ date: dayjs().subtract(1, "month").toDate() }),
      ];

      // WHEN
      const result = getLastVisitInMonths(evaluations, controles);

      // THEN
      expect(result).toBe(1);
    });

    it("should return the difference in months from the most recent evaluation when it is later than the last controle", () => {
      // GIVEN
      const evaluations: Evaluation[] = [
        createEvaluation({ date: dayjs().subtract(1, "month").toDate() }),
      ];
      const controles: Controle[] = [
        createControle({ date: dayjs().subtract(3, "month").toDate() }),
      ];

      // WHEN
      const result = getLastVisitInMonths(evaluations, controles);

      // THEN
      expect(result).toBe(1);
    });

    it("should return the difference in months from the most recent controle when it is later than the last evaluation", () => {
      // GIVEN
      const evaluations: Evaluation[] = [
        createEvaluation({ date: dayjs().subtract(4, "month").toDate() }),
      ];
      const controles: Controle[] = [
        createControle({ date: dayjs().subtract(2, "month").toDate() }),
      ];

      // WHEN
      const result = getLastVisitInMonths(evaluations, controles);

      // THEN
      expect(result).toBe(2);
    });
  });
});
