"use client";

import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { getCurrentStepData } from "@/app/(authenticated)/structures/[id]/finalisation/components/Steps";
import { FieldSetOuvertureFermeture } from "@/app/components/forms/fieldsets/structure/FieldSetOuvertureFermeture";
import { FieldSetTypePlaces } from "@/app/components/forms/fieldsets/structure/FieldSetTypePlaces";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import { StructureState } from "@/types/structure.type";

import { finalisationTypePlacesSchema } from "./validation/finalisationTypePlacesSchema";

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
      schema={finalisationTypePlacesSchema}
      onSubmit={(data) => {
        handleSubmit({
          ...data,
          dnaCode: structure.dnaCode,
        });
      }}
      defaultValues={defaultValues}
      submitButtonText="Étape suivante"
      previousStep={previousRoute}
      availableFooterButtons={[FooterButtonType.SUBMIT]}
    >
      {structure.state === StructureState.A_FINALISER && (
        <InformationBar
          variant="warning"
          title="À vérifier"
          description="Veuillez vérifier les informations et/ou les documents suivants transmis par l’opérateur."
        />
      )}

      <FieldSetTypePlaces />

      <div>
        {structure.state === StructureState.A_FINALISER && (
          <InformationBar
            variant="info"
            title="À compléter"
            description="Veuillez remplir les champs obligatoires ci-dessous. Si une donnée vous est inconnue, contactez-nous."
          />
        )}
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
