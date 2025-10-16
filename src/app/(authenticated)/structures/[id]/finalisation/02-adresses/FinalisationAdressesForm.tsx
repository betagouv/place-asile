"use client";

import Notice from "@codegouvfr/react-dsfr/Notice";

import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { getCurrentStepData } from "@/app/(authenticated)/structures/[id]/finalisation/components/Steps";
import { FieldSetAdresseAdministrative } from "@/app/components/forms/fieldsets/structure/FieldSetAdresseAdministrative";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import WarningVerifyFields from "@/app/components/forms/WarningVerifyFields";
import { SubmitError } from "@/app/components/SubmitError";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import {
  AdresseAdministrativeFormValues,
  adresseAdministrativeSchema,
} from "@/schemas/base/adresseAdministrative.schema";

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

  const onSubmit = (data: AdresseAdministrativeFormValues) => {
    handleSubmit({ ...data, dnaCode: structure.dnaCode });
  };

  return (
    <FormWrapper
      schema={adresseAdministrativeSchema}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      submitButtonText="Étape suivante"
      previousStep={previousRoute}
      availableFooterButtons={[FooterButtonType.SUBMIT]}
    >
      <WarningVerifyFields structure={structure} />

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
