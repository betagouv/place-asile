"use client";

import { AutoSave } from "@/app/components/forms/AutoSave";
import { FieldSetNotes } from "@/app/components/forms/fieldsets/structure/FieldSetNotes";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { NoteDisclaimer } from "@/app/components/forms/notes/NoteDisclaimer";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useFetchState } from "@/app/context/FetchStateContext";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import {
  NotesAutoSaveFormValues,
  notesAutoSaveSchema,
  notesSchema,
} from "@/schemas/base/notes.schema";
import { FetchState } from "@/types/fetch-state.type";

import { useStructureContext } from "../../context/StructureClientContext";
import { Tabs } from "../_components/Tabs";

export default function FinalisationNotes() {
  const { structure } = useStructureContext();

  const currentStep = "06-notes";

  const defaultValues = getDefaultValues({ structure });

  const { handleValidation, handleAutoSave, backendError } =
    useAgentFormHandling();

  const onAutoSave = async (data: NotesAutoSaveFormValues) => {
    await handleAutoSave({ ...data, dnaCode: structure.dnaCode });
  };

  const { getFetchState } = useFetchState();
  const saveState = getFetchState("structure-save");

  return (
    <div>
      <Tabs currentStep={currentStep} structure={structure} />
      <FormWrapper
        schema={notesSchema}
        onSubmit={handleValidation}
        defaultValues={defaultValues}
        submitButtonText="Je valide la saisie de cette page"
        availableFooterButtons={[FooterButtonType.SUBMIT]}
        className="rounded-t-none"
      >
        <AutoSave schema={notesAutoSaveSchema} onSave={onAutoSave} />
        <InformationBar
          variant="complete"
          title="À compléter"
          description="Veuillez utiliser cet espace pour centraliser et annoter les informations nécessaires au pilotage de la structure : élément contextuel, prochaine échéance, document à produire, point d'attention, élément relationnel avec la structure..."
        />

        <NoteDisclaimer />

        <FieldSetNotes />
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
