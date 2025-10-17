"use client";

import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { FieldSetCalendrier } from "@/app/components/forms/fieldsets/structure/FieldSetCalendrier";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import { calendrierSchema } from "@/schemas/base/calendrier.schema";
import { FetchState } from "@/types/fetch-state.type";

import { ModificationTitle } from "../components/ModificationTitle";

export default function ModificationCalendrier() {
  const { structure } = useStructureContext();

  const { handleSubmit, state, backendError } = useAgentFormHandling({
    nextRoute: `/structures/${structure.id}`,
  });

  const defaultValues = getDefaultValues({ structure });

  return (
    <>
      <ModificationTitle
        step="Calendrier"
        closeLink={`/structures/${structure.id}`}
      />
      <FormWrapper
        schema={calendrierSchema}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        mode="onChange"
        resetRoute={`/structures/${structure.id}`}
        submitButtonText="Valider"
        availableFooterButtons={[
          FooterButtonType.CANCEL,
          FooterButtonType.SUBMIT,
        ]}
        className="border-[2px] border-solid border-[var(--text-title-blue-france)]"
      >
        <FieldSetCalendrier />
      </FormWrapper>
      {state === FetchState.ERROR && (
        <SubmitError
          structureDnaCode={structure.dnaCode}
          backendError={backendError}
        />
      )}
    </>
  );
}
