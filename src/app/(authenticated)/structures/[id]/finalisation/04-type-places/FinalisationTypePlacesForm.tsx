"use client";

import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { getCurrentStepData } from "@/app/(authenticated)/structures/[id]/finalisation/components/Steps";
import { FieldSetOuvertureFermeture } from "@/app/components/forms/fieldsets/structure/FieldSetOuvertureFermeture";
import { FieldSetTypePlaces } from "@/app/components/forms/fieldsets/structure/FieldSetTypePlaces";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import WarningRequiredFields from "@/app/components/forms/WarningRequiredFields";
import WarningVerifyFields from "@/app/components/forms/WarningVerifyFields";
import { SubmitError } from "@/app/components/SubmitError";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import { typePlacesSchema } from "@/schemas/base/typePlaces.schema";

export default function FinalisationTypePlacesForm({
  currentStep,
}: {
  currentStep: number;
}) {
  const { structure } = useStructureContext();
  const { nextRoute, previousRoute } = getCurrentStepData(
    currentStep,
    structure.id
  );

  const defaultValues = getDefaultValues({ structure });

  const { handleSubmit, state, backendError } = useAgentFormHandling({
    nextRoute,
  });

  return (
    <FormWrapper
      schema={typePlacesSchema}
      onSubmit={async (data) => {
        await handleSubmit({
          ...data,
          dnaCode: structure.dnaCode,
        });
      }}
      defaultValues={defaultValues}
      submitButtonText="Étape suivante"
      previousStep={previousRoute}
      availableFooterButtons={[FooterButtonType.SUBMIT]}
    >
      <WarningVerifyFields structure={structure} />

      <FieldSetTypePlaces />

      <div>
        <WarningRequiredFields structure={structure} />

        <FieldSetOuvertureFermeture />
      </div>

      {state === "error" && (
        <SubmitError
          structureDnaCode={structure.dnaCode}
          backendError={backendError}
        />
      )}
    </FormWrapper>
  );
}
