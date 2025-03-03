import { computeNbPlaces } from "@/app/utils/structure.util";
import { Structure } from "@/types/structure.type";
import { createStructures } from "../test-utils/structure.factory";

describe("structure util", () => {
  describe("computeNbPlaces", () => {
    it("should return 0 when given an empty array", () => {
      // GIVEN
      const structuresArray: Structure[] = [];

      // WHEN
      const nbPlaces = computeNbPlaces(structuresArray);

      // THEN
      expect(nbPlaces).toStrictEqual(0);
    });
    it("should return the sum of nbPlaces when given a structures array", () => {
      // GIVEN
      const structuresArray: Structure[] = createStructures({ nbPlaces: 6 });

      // WHEN
      const nbPlaces = computeNbPlaces(structuresArray);

      // THEN
      expect(nbPlaces).toStrictEqual(18);
    });
  });
});
