/**
 * We need to use a component (rather than a hook directly) because
 * useAutoSave relies on being called within the context provided by FormWrapper.
 * By rendering this component as a child of FormWrapper,
 * we ensure that the hook can access the form context.
 */
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

import { useDebounceCallback } from "@/app/hooks/useDebounceCallback";

const DEBOUNCE_TIME = 500;

export const AutoSave = <TSchema extends z.ZodTypeAny>({
  schema,
  onSave,
}: {
  schema: TSchema;
  onSave: (data: z.infer<TSchema>) => Promise<void>;
}) => {
  const { watch, getValues } = useFormContext<z.infer<TSchema>>();

  const debouncedSave = useDebounceCallback(async () => {
    const allValues = getValues();

    const result = schema.safeParse(allValues);

    if (result.success) {
      console.log("Saving", result.data);
      await onSave(result.data);
    } else {
      console.error("AutoSave: données partielles", result.error);
      console.error("Error data", result.data);
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
