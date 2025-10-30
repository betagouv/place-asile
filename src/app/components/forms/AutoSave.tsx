import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

import { useDebounceCallback } from "@/app/hooks/useDebounceCallback";
import { ControleFormValues } from "@/schemas/forms/base/controles.schema";
import { EvaluationFormValues } from "@/schemas/forms/base/evaluation.schema";

const DEBOUNCE_TIME = 500;

export const AutoSave = <TSchema extends z.ZodTypeAny>({
  schema,
  onSave,
}: {
  schema: TSchema;
  onSave: (data: z.infer<TSchema>) => Promise<void>;
}) => {
  const { watch, getValues } = useFormContext<z.infer<TSchema>>();

  const sanitizeValues = (allValues: z.TypeOf<TSchema>): z.TypeOf<TSchema> => {
    return {
      ...allValues,
      evaluations: allValues.evaluations.filter(
        (evaluation: EvaluationFormValues) => evaluation.date !== ""
      ),
      controles: allValues.controles.filter(
        (controle: ControleFormValues) => controle.date !== ""
      ),
    };
  };

  const debouncedSave = useDebounceCallback(async () => {
    const allValues = getValues();
    const sanitizedValues = sanitizeValues(allValues);
    const result = schema.safeParse(sanitizedValues);

    if (result.success) {
      await onSave(result.data);
    } else {
      console.error("AutoSave: données partielles", result.error);
    }
  }, DEBOUNCE_TIME);

  useEffect(() => {
    const subscription = watch(() => {
      debouncedSave();
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);

  return null;
};
