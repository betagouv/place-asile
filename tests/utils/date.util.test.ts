import {
  formatDate,
  formatForCharts,
  getLastMonths,
  getMonthsBetween,
  getYearDate,
  parseFrDate,
} from "@/app/utils/date.util";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");

describe("date util", () => {
  describe("formatDate", () => {
    it("should return the string of a formatted date with a string input", () => {
      // GIVEN
      const date = "12/12/2012";

      // WHEN
      const formattedDate = formatDate(date);

      // THEN
      expect(formattedDate).toBe("12/12/2012");
    });
    it("should return the string of a formatted date with a date input", () => {
      // GIVEN
      const date = new Date("12/12/2012");

      // WHEN
      const formattedDate = formatDate(date);

      // THEN
      expect(formattedDate).toBe("12/12/2012");
    });
  });
  describe("getMonthsBetween", () => {
    it("should return an empty array for invalid start or end date", () => {
      // GIVEN
      const invalidStartDateNull = null;
      const invalidEndDateNull = null;
      const invalidStartDateString = "invalid date";
      const invalidEndDateString = "not a date";
      const validEndDate = "2025-03-01";
      const validStartDate = "2025-01-01";

      // WHEN
      const result1 = getMonthsBetween(invalidStartDateNull, validEndDate);
      const result2 = getMonthsBetween(validStartDate, invalidEndDateNull);
      const result3 = getMonthsBetween(invalidStartDateString, validEndDate);
      const result4 = getMonthsBetween(validStartDate, invalidEndDateString);

      // THEN
      expect(result1).toEqual([]);
      expect(result2).toEqual([]);
      expect(result3).toEqual([]);
      expect(result4).toEqual([]);
    });

    it("should return an empty array if start date is after end date", () => {
      // GIVEN
      const startDate = "2025-03-01";
      const endDate = "2025-01-01";

      // WHEN
      const result = getMonthsBetween(startDate, endDate);

      // THEN
      expect(result).toEqual([]);
    });

    it("should return a single month if start and end dates are in the same month", () => {
      // GIVEN
      const startDate = "2025-02-10";
      const endDate = "2025-02-20";

      // WHEN
      const result = getMonthsBetween(startDate, endDate);

      // THEN
      expect(result).toEqual([dayjs("2025-02-01")]);
    });

    it("should return the correct months between two dates", () => {
      // GIVEN
      const startDate1 = "2024-12-15";
      const endDate1 = "2025-03-01";
      const startDate2 = "2025-01-01";
      const endDate2 = "2025-02-28";
      const startDate3 = "2025-03-31";
      const endDate3 = "2025-05-01";

      // WHEN
      const result1 = getMonthsBetween(startDate1, endDate1);
      const result2 = getMonthsBetween(startDate2, endDate2);
      const result3 = getMonthsBetween(startDate3, endDate3);

      // THEN
      expect(result1).toEqual([
        dayjs("2024-12-01"),
        dayjs("2025-01-01"),
        dayjs("2025-02-01"),
        dayjs("2025-03-01"),
      ]);
      expect(result2).toEqual([dayjs("2025-01-01"), dayjs("2025-02-01")]);
      expect(result3).toEqual([
        dayjs("2025-03-01"),
        dayjs("2025-04-01"),
        dayjs("2025-05-01"),
      ]);
    });

    it("should handle Date objects as input", () => {
      // GIVEN
      const startDate = new Date("2025-01-15");
      const endDate = new Date("2025-03-10");

      // WHEN
      const result = getMonthsBetween(startDate, endDate);

      // THEN
      expect(result).toEqual([
        dayjs("2025-01-01"),
        dayjs("2025-02-01"),
        dayjs("2025-03-01"),
      ]);
    });
  });

  describe("getLastMonths", () => {
    it("should return an empty array if numberOfMonths is zero or negative", () => {
      // GIVEN
      const zeroMonths = 0;
      const negativeMonths = -3;

      // WHEN
      const resultZero = getLastMonths(zeroMonths);
      const resultNegative = getLastMonths(negativeMonths);

      // THEN
      expect(resultZero).toEqual([]);
      expect(resultNegative).toEqual([]);
    });

    it("should return the last N months including the current month", () => {
      // GIVEN
      const mockedDate = dayjs("2025-04-10");
      vi.useFakeTimers();
      vi.setSystemTime(mockedDate.toDate());
      const numberOfMonths1 = 1;
      const numberOfMonths3 = 3;
      const numberOfMonths6 = 6;

      // WHEN
      const result1 = getLastMonths(numberOfMonths1);
      const result3 = getLastMonths(numberOfMonths3);
      const result6 = getLastMonths(numberOfMonths6);

      // THEN
      expect(result1).toEqual([dayjs("2025-04-10")]);
      expect(result3).toEqual([
        dayjs("2025-02-10"),
        dayjs("2025-03-10"),
        dayjs("2025-04-10"),
      ]);
      expect(result6).toEqual([
        dayjs("2024-11-10"),
        dayjs("2024-12-10"),
        dayjs("2025-01-10"),
        dayjs("2025-02-10"),
        dayjs("2025-03-10"),
        dayjs("2025-04-10"),
      ]);
      vi.useRealTimers();
    });
  });

  describe("formatForCharts", () => {
    it("should format a date in french when given a valid date", () => {
      // GIVEN
      const date = dayjs("02-02-2025");

      // WHEN
      const result = formatForCharts(date);

      // THEN
      expect(result).toBe("FÉVR. 2025");
    });
  });

  describe("getYearDate", () => {
    it("should return the date for January 1st at 13:00 for a given year as a string", () => {
      // GIVEN
      const year = "2020";

      // WHEN
      const result = getYearDate(year);

      // THEN
      expect(result).toMatch(/^(0?1\/0?1\/2020|2020-01-01|1\/1\/2020)$/);
    });
  });

  describe("parseFrDate", () => {
    it('should parse a valid "DD/MM/YYYY" string to a Date object', () => {
      // GIVEN
      const dateStr = "25/12/2022";

      // WHEN
      const result = parseFrDate(dateStr);

      // THEN
      expect(result).toBeInstanceOf(Date);
      expect((result as Date).getFullYear()).toBe(2022);
      expect((result as Date).getMonth()).toBe(11);
      expect((result as Date).getDate()).toBe(25);
    });

    it("should return the input if string is not a valid date", () => {
      // GIVEN
      const input = "32/13/2022";

      // WHEN
      const result = parseFrDate(input);

      // THEN
      expect(result).toBe(input);
    });

    it("should parse leap year dates correctly", () => {
      // GIVEN
      const input = "29/02/2024";

      // WHEN
      const result = parseFrDate(input);

      // THEN
      expect(result).toBeInstanceOf(Date);
      expect((result as Date).getFullYear()).toBe(2024);
      expect((result as Date).getMonth()).toBe(1);
      expect((result as Date).getDate()).toBe(29);
    });
  });
});
