import { sortKeysByValue } from "@/app/utils/common.util";

describe("common util", () => {
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
