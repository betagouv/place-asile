"use client";

import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { FieldSetCalendrier } from "@/app/components/forms/fieldsets/structure/FieldSetCalendrier";
import { FieldSetContacts } from "@/app/components/forms/fieldsets/structure/FieldSetContacts";
import { FieldSetDescription } from "@/app/components/forms/fieldsets/structure/FieldSetDescription";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import { Contact } from "@/types/contact.type";
import { StructureState } from "@/types/structure.type";

import { getCurrentStepData } from "../components/Steps";
import {
  FinalisationIdentificationFormValues,
  finalisationIdentificationSchema,
} from "./validation/FinalisationIdentificationSchema";

export default function FinalisationIdentificationForm({
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

  const onSubmit = (data: FinalisationIdentificationFormValues) => {
    const contacts = data.contacts
      .filter((contact): contact is Contact => contact !== undefined)
      .filter((contact: Contact) =>
        Object.values(contact).every((field) => field !== undefined)
      );
    handleSubmit({ ...data, contacts });
  };

  return (
    <>
      <FormWrapper
        schema={finalisationIdentificationSchema}
        defaultValues={defaultValues}
        submitButtonText="Étape suivante"
        previousStep={previousRoute}
        availableFooterButtons={[FooterButtonType.SUBMIT]}
        onSubmit={onSubmit}
        mode="onChange"
      >
        {structure.state === StructureState.A_FINALISER && (
          <InformationBar
            variant="warning"
            title="À vérifier"
            description="Veuillez vérifier les informations et/ou les documents suivants transmis par l’opérateur."
          />
        )}
        <FieldSetDescription dnaCode={structure.dnaCode} />
        <hr />
        <FieldSetContacts />
        <hr />
        <FieldSetCalendrier />
        {state === "error" && (
          <SubmitError
            structureDnaCode={structure.dnaCode}
            backendError={backendError}
          />
        )}
      </FormWrapper>
    </>
  );
}
