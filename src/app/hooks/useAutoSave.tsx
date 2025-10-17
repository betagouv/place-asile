import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

import { useDebounceCallback } from "@/app/hooks/useDebounceCallback";

export const useAutoSave = <TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  onSave: (data: z.infer<TSchema>) => Promise<void>
) => {
  const { watch, getValues } = useFormContext<z.infer<TSchema>>();

  const debouncedSave = useDebounceCallback(async () => {
    const allValues = getValues();

    const result = schema.safeParse(allValues);

    if (result.success) {
      await onSave(result.data);
    } else {
      console.error("AutoSave: données partielles", result.error);
    }
  }, 1000);

  useEffect(() => {
    const subscription = watch(() => {
      debouncedSave();
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);
};
