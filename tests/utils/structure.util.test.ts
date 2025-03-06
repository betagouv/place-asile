import { getPlacesByCommunes } from "@/app/utils/structure.util";
import { Logement } from "../../src/types/logement.type";

// TODO : implement this test
describe.todo("structure util", () => {
  describe("getPlacesByCommunes", () => {
    it("should return 0 when given an empty array", () => {
      // GIVEN
      const logements: Logement[] = [];

      // WHEN
      const placesByCommune = getPlacesByCommunes(logements);

      // THEN
      expect(placesByCommune).toStrictEqual(0);
    });
    it("should return the sum of nbPlaces when given a structures array", () => {
      // GIVEN
      const logements: Logement[] = [];

      // WHEN
      const placesByCommune = getPlacesByCommunes(logements);

      // THEN
      expect(placesByCommune).toStrictEqual(18);
    });
  });
});
