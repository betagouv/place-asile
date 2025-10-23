"use client";
import { ReactElement } from "react";

import { AutoSave } from "@/app/components/forms/AutoSave";
import { FieldSetAdresseAdministrative } from "@/app/components/forms/fieldsets/structure/FieldSetAdresseAdministrative";
import { FieldSetCalendrier } from "@/app/components/forms/fieldsets/structure/FieldSetCalendrier";
import { FieldSetContacts } from "@/app/components/forms/fieldsets/structure/FieldSetContacts";
import { FieldSetDescription } from "@/app/components/forms/fieldsets/structure/FieldSetDescription";
import { FieldSetTypePlaces } from "@/app/components/forms/fieldsets/structure/FieldSetTypePlaces";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useFetchState } from "@/app/context/FetchStateContext";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { transformAgentFormContactsToApiContacts } from "@/app/utils/contacts.util";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import {
  FinalisationIdentificationAutoSaveFormValues,
  finalisationIdentificationAutoSaveSchema,
  finalisationIdentificationSchema,
} from "@/schemas/finalisation/finalisationIdentification.schema";
import { FetchState } from "@/types/fetch-state.type";
import { FormKind } from "@/types/global";

import { useStructureContext } from "../../_context/StructureClientContext";
import { Tabs } from "../_components/Tabs";

export default function FinalisationIdentification(): ReactElement {
  const { structure } = useStructureContext();

  const currentStep = "01-identification";

  const isCompleted = structure.finalisationSteps?.some(
    (step) => step.label === currentStep
  );

  const defaultValues = getDefaultValues({ structure });

  const { handleValidation, handleAutoSave, backendError } =
    useAgentFormHandling({ currentStep });

  const onAutoSave = async (
    data: FinalisationIdentificationAutoSaveFormValues
  ) => {
    const contacts = transformAgentFormContactsToApiContacts(data.contacts);
    await handleAutoSave({ ...data, contacts });
  };

  const { getFetchState } = useFetchState();
  const saveState = getFetchState("structure-save");

  return (
    <div>
      <Tabs currentStep={currentStep} />
      <FormWrapper
        schema={finalisationIdentificationSchema}
        defaultValues={defaultValues}
        submitButtonText="Je valide la saisie de cette page"
        availableFooterButtons={[FooterButtonType.SUBMIT]}
        onSubmit={handleValidation}
        mode="onBlur"
        className="rounded-t-none"
      >
        <AutoSave
          schema={finalisationIdentificationAutoSaveSchema}
          onSave={onAutoSave}
        />
        <InformationBar
          variant={isCompleted ? "success" : "verify"}
          title={isCompleted ? "Vérifié" : "À vérifier"}
          description="Veuillez vérifier les informations suivantes transmises par l’opérateur."
        />

        <FieldSetDescription dnaCode={structure.dnaCode} />
        <hr />

        <FieldSetContacts />
        <hr />

        <FieldSetCalendrier />
        <hr />

        <FieldSetAdresseAdministrative formKind={FormKind.FINALISATION} />
        <hr />

        <FieldSetTypePlaces formKind={FormKind.FINALISATION} />

        {saveState === FetchState.ERROR && (
          <SubmitError
            structureDnaCode={structure.dnaCode}
            backendError={backendError}
          />
        )}
      </FormWrapper>
    </div>
  );
}
