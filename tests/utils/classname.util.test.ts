import { cn } from "@/app/utils/classname.util";

describe("classname util", () => {
  describe("cn", () => {
    it("should concatenate to one string when given two strings", () => {
      // GIVEN
      const class1 = "text-red-500";
      const class2 = "bg-blue-200";

      // WHEN
      const result = cn(class1, class2);

      // THEN
      expect(result).toBe("text-red-500 bg-blue-200");
    });

    it("should contextually input classes", () => {
      // GIVEN
      const isPrimary = true;

      // WHEN
      const result = cn(
        "btn",
        isPrimary && "btn-primary",
        !isPrimary && "btn-secondary"
      );

      // THEN
      expect(result).toBe("btn btn-primary");
    });

    it("should return a concatenated string when given classes, arrays and objects", () => {
      // GIVEN
      const hasShadow = true;

      // WHEN
      const result = cn("card", ["p-4", "rounded"], { "shadow-lg": hasShadow });

      // THEN
      expect(result).toBe("card p-4 rounded shadow-lg");
    });

    it("should return the last string when there are conflicts", () => {
      // GIVEN
      const class1 = "px-4 text-sm";
      const class2 = "px-6 text-lg";

      // WHEN
      const result = cn(class1, class2);

      // THEN
      expect(result).toBe("px-6 text-lg");
    });
  });
});
