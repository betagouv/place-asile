import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

import { useDebounceCallback } from "@/app/hooks/useDebounceCallback";

export const useAutoSave = <TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  onSave: (data: z.infer<TSchema>) => Promise<void>
) => {
  const { watch, trigger, getValues } = useFormContext<z.infer<TSchema>>();

  const debouncedSave = useDebounceCallback(async () => {
    const isValid = await trigger();
    if (isValid) {
      const allValues = getValues();
      const data = schema.parse(allValues);
      await onSave(data);
    }
  }, 1000);

  useEffect(() => {
    const subscription = watch(() => {
      debouncedSave();
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);
};
