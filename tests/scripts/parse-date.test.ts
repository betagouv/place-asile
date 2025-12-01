import { parseDate } from "../../scripts/utils/parse-date";

describe("parseDate util", () => {
  it("should trim the value and throw when the string is empty", () => {
    // GIVEN
    const value = "   ";
    const context = "date_debut";

    // WHEN / THEN
    expect(() => parseDate(value, context)).toThrowError(
      "date_debut: valeur vide"
    );
  });

  it("should parse a 4-digit year as January 1st at 12:00:00 of that year", () => {
    // GIVEN
    const value = "2021";
    const context = "year";

    // WHEN
    const result = parseDate(value, context);

    // THEN
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2021);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(1);
    expect(result.getHours()).toBe(12);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });

  it("should parse a valid ISO-like date string", () => {
    // GIVEN
    const value = "2024-03-15T10:30:00.000Z";
    const context = "iso";

    // WHEN
    const result = parseDate(value, context);

    // THEN
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBe(new Date(value).getTime());
  });

  it("should throw an error for an invalid non-empty date string", () => {
    // GIVEN
    const value = "not-a-date";
    const context = "date_fin";

    // WHEN / THEN
    expect(() => parseDate(value, context)).toThrowError(
      "date_fin: format de date invalide (not-a-date)"
    );
  });
});
