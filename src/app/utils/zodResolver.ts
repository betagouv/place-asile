import { FieldValues, Resolver } from "react-hook-form";
import { z } from "zod";

export function zodResolver<T extends z.ZodTypeAny>(
  schema: T
): Resolver<FieldValues> {
  return async (values) => {
    try {
      const result = await schema.parseAsync(values);
      return {
        values: result as FieldValues,
        errors: {},
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, any> = {};

        error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          fieldErrors[path] = {
            type: issue.code,
            message: issue.message,
          };
        });

        return {
          values: {},
          errors: fieldErrors,
        };
      }

      throw error;
    }
  };
}
