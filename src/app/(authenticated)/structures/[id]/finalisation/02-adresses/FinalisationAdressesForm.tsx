"use client";

import Notice from "@codegouvfr/react-dsfr/Notice";

import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { getCurrentStepData } from "@/app/(authenticated)/structures/[id]/finalisation/components/Steps";
import { FieldSetAdresseAdministrative } from "@/app/components/forms/fieldsets/structure/FieldSetAdresseAdministrative";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import { StructureState } from "@/types/structure.type";

import { finalisationAdressesSchema } from "./validation/finalisationAdressesSchema";

export default function FinalisationAdressesForm({
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
      schema={finalisationAdressesSchema}
      onSubmit={(data) =>
        handleSubmit({
          ...data,
          dnaCode: structure.dnaCode,
        })
      }
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

      <Notice
        severity="info"
        title=""
        className="rounded [&_p]:flex  [&_p]:items-center"
        description="L’ensemble des adresses ne seront communiquées qu’aux agentes et agents en charge de cette politique publique."
      />
      <FieldSetAdresseAdministrative />
      {state === "error" && (
        <SubmitError
          structureDnaCode={structure.dnaCode}
          backendError={backendError}
        />
      )}
    </FormWrapper>
  );
}
