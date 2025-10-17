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
import { FetchState } from "@/types/fetch-state.type";

export const AutoSave = <TSchema extends z.ZodTypeAny>({
  schema,
  onSave,
  state,
}: {
  schema: TSchema;
  onSave: (data: z.infer<TSchema>) => Promise<void>;
  state: FetchState;
}) => {
  useAutoSave(schema, onSave);

  if (state === FetchState.LOADING) {
    return <span>LOADING</span>;
  }
  if (state === FetchState.ERROR) {
    return <span>ERROR</span>;
  }
  return <span>IDLE</span>;
};
