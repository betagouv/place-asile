/**
 * This component wraps the useAutoSave hook in a React component.
 *
 * We need to use a component (rather than a hook directly) because
 * useAutoSave relies on being called within the context provided by FormWrapper.
 * By rendering this component as a child of FormWrapper,
 * we ensure that the hook can access the form context.
 */
import { z } from "zod";

import { useAutoSave } from "@/app/hooks/useAutoSave";

export const AutoSave = <TSchema extends z.ZodTypeAny>({
  schema,
  onSave,
}: {
  schema: TSchema;
  onSave: (data: z.infer<TSchema>) => Promise<void>;
}) => {
  useAutoSave(schema, onSave);

  return null;
};
