import { ReactElement } from "react";

import { FieldSetNotes } from "@/app/components/forms/fieldsets/structure/FieldSetNotes";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { NoteDisclaimer } from "@/app/components/forms/notes/NoteDisclaimer";
import WarningRequiredFields from "@/app/components/forms/WarningRequiredFields";
import { SubmitError } from "@/app/components/SubmitError";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import { notesSchema } from "@/schemas/base/notes.schema";
import { StructureState } from "@/types/structure.type";

import { useStructureContext } from "../../context/StructureClientContext";
import { getCurrentStepData } from "../components/Steps";

export const FinalisationNotesForm = ({ currentStep }: Props): ReactElement => {
  const { structure } = useStructureContext();

  const { previousRoute } = getCurrentStepData(currentStep, structure.id);

  const defaultValues = getDefaultValues({ structure });

  const { handleSubmit, state, backendError } = useAgentFormHandling({
    nextRoute: `${process.env.NEXT_PUBLIC_URL}/structures/${structure.id}`,
  });

  return (
    <FormWrapper
      schema={notesSchema}
      onSubmit={async (data) =>
        await handleSubmit({
          ...data,
          dnaCode: structure.dnaCode,
          state: StructureState.FINALISE,
        })
      }
      defaultValues={defaultValues}
      submitButtonText="Terminer"
      previousStep={previousRoute}
      availableFooterButtons={[FooterButtonType.SUBMIT]}
    >
      <WarningRequiredFields structure={structure} />

      <NoteDisclaimer />

      <FieldSetNotes />
      {state === "error" && (
        <SubmitError
          structureDnaCode={structure.dnaCode}
          backendError={backendError}
        />
      )}
    </FormWrapper>
  );
};

type Props = {
  currentStep: number;
};
