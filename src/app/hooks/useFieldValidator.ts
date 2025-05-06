import { z } from "zod";

type ZodObjectShape = Record<string, z.ZodTypeAny>;

export function useFieldValidator<T extends z.ZodObject<ZodObjectShape>>(
  schema: T
) {
  const validateField = (
    fieldName: string,
    value: unknown
  ): string[] | undefined => {
    const fieldSchema = schema.shape[fieldName as keyof typeof schema.shape];

    if (!fieldSchema) {
      console.error(`Field ${fieldName} not found in schema`);
      return;
    }

    const result = fieldSchema.safeParse(value);

    if (!result.success) {
      return result.error.errors.map((err: z.ZodIssue) => err.message);
    }
    return;
  };

  return { validateField };
}
