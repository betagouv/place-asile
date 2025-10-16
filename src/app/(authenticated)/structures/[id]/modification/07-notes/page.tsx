"use client";
import { ReactElement } from "react";

import { FieldSetNotes } from "@/app/components/forms/fieldsets/structure/FieldSetNotes";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { NoteDisclaimer } from "@/app/components/forms/notes/NoteDisclaimer";
import { SubmitError } from "@/app/components/SubmitError";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import { notesSchema } from "@/schemas/base/notes.schema";

import { useStructureContext } from "../../context/StructureClientContext";
import { ModificationTitle } from "../components/ModificationTitle";

export default function ModificationNotesForm(): ReactElement {
  const { structure } = useStructureContext();

  const defaultValues = getDefaultValues({ structure });

  const { handleSubmit, state, backendError } = useAgentFormHandling({
    nextRoute: `/structures/${structure.id}`,
  });

  return (
    <>
      <ModificationTitle
        step="Notes"
        closeLink={`/structures/${structure.id}`}
      />
      <FormWrapper
        schema={notesSchema}
        onSubmit={(data) =>
          handleSubmit({
            ...data,
            dnaCode: structure.dnaCode,
          })
        }
        defaultValues={defaultValues}
        submitButtonText="Valider"
        availableFooterButtons={[
          FooterButtonType.CANCEL,
          FooterButtonType.SUBMIT,
        ]}
        className="border-[2px] border-solid border-[var(--text-title-blue-france)]"
      >
        <NoteDisclaimer />
        <FieldSetNotes />
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
