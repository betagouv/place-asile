import { formatDate } from "@/app/utils/date.util";

describe("date util", () => {
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
