"use client";

import { useStructureContext } from "@/app/(authenticated)/structures/[id]/_context/StructureClientContext";
import { FieldSetOuvertureFermeture } from "@/app/components/forms/fieldsets/structure/FieldSetOuvertureFermeture";
import { FieldSetTypePlaces } from "@/app/components/forms/fieldsets/structure/FieldSetTypePlaces";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { useFetchState } from "@/app/context/FetchStateContext";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import { typePlacesSchema } from "@/schemas/forms/base/typePlaces.schema";
import { FetchState } from "@/types/fetch-state.type";
import { FormKind } from "@/types/global";

import { ModificationTitle } from "../components/ModificationTitle";

export default function ModificationTypePlaces() {
  const { structure } = useStructureContext();

  const { handleSubmit, backendError } = useAgentFormHandling({
    nextRoute: `/structures/${structure.id}`,
  });

  const defaultValues = getDefaultValues({ structure });

  const { getFetchState } = useFetchState();
  const saveState = getFetchState("structure-save");

  return (
    <>
      <ModificationTitle
        step="Types de places"
        closeLink={`/structures/${structure.id}`}
      />
      <FormWrapper
        schema={typePlacesSchema}
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
        <FieldSetOuvertureFermeture formKind={FormKind.MODIFICATION} />
        <FieldSetTypePlaces />
      </FormWrapper>
      {saveState === FetchState.ERROR && (
        <SubmitError
          structureDnaCode={structure.dnaCode}
          backendError={backendError}
        />
      )}
    </>
  );
}
