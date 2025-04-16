import {
  computeAverage,
  getPercentage,
  sortKeysByValue,
} from "@/app/utils/common.util";

describe("common util", () => {
  describe("sortKeysByValue", () => {
    it("should return an empty object when given an empty object", () => {
      // GIVEN
      const unsortedObject = {};

      // WHEN
      const sortedObject = sortKeysByValue(unsortedObject);

      // THEN
      expect(sortedObject).toStrictEqual({});
    });
    it("should return a sorted object by value when given an unsorted object", () => {
      // GIVEN
      const unsortedObject = {
        a: 3,
        b: 2,
        c: 4,
      };

      // WHEN
      const sortedObject = sortKeysByValue(unsortedObject);

      // THEN
      expect(sortedObject).toStrictEqual({
        b: 2,
        a: 3,
        c: 4,
      });
    });
  });
  describe("getPercentage", () => {
    it("should return < 1% if percentage is below 1", () => {
      // GIVEN
      const partialValue = 1;
      const totalValue = 300;

      // WHEN
      const percentage = getPercentage(partialValue, totalValue);

      // THEN
      expect(percentage).toBe("< 1%");
    });
    it("should return correct percentage if percentage is more than 1", () => {
      // GIVEN
      const partialValue = 100;
      const totalValue = 300;

      // WHEN
      const percentage = getPercentage(partialValue, totalValue);

      // THEN
      expect(percentage).toBe("33%");
    });
  });
  describe("computeAverage", () => {
    it("should return 0 when given an empty array", () => {
      // GIVEN
      const array: number[] = [];

      // WHEN
      const result = computeAverage(array);

      // THEN
      expect(result).toBe(0);
    });
    it("should return the average when given a corrrect array of numbers", () => {
      // GIVEN
      const array = [3, 8, 5, 1, 0];

      // WHEN
      const result = computeAverage(array);

      // THEN
      expect(result).toBe(3.4);
    });
  });
});
