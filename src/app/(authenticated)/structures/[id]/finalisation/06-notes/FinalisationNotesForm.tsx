import Notice from "@codegouvfr/react-dsfr/Notice";
import { ReactElement } from "react";

import { FieldSetNotes } from "@/app/components/forms/fieldsets/structure/FieldSetNotes";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import { StructureState } from "@/types/structure.type";

import { useStructureContext } from "../../context/StructureClientContext";
import { getCurrentStepData } from "../components/Steps";
import { finalisationNotesSchema } from "./validation/finalisationNotesSchema";

export const FinalisationNotesForm = ({ currentStep }: Props): ReactElement => {
  const { structure } = useStructureContext();

  const { previousRoute } = getCurrentStepData(currentStep, structure.id);

  const defaultValues = getDefaultValues({ structure });

  const { handleSubmit, state, backendError } = useAgentFormHandling({
    nextRoute: `${process.env.NEXT_PUBLIC_URL}/structures/${structure.id}`,
  });

  return (
    <FormWrapper
      schema={finalisationNotesSchema}
      onSubmit={(data) =>
        handleSubmit({
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
      {structure.state === StructureState.A_FINALISER && (
        <InformationBar
          variant="info"
          title="À compléter"
          description="Veuillez remplir les champs obligatoires ci-dessous. Si une donnée vous est inconnue, contactez-nous."
        />
      )}

      <Notice
        severity="info"
        title=""
        className="rounded [&_p]:flex [&_p]:items-center"
        description="Afin de centraliser toutes les données concernant cette structure, vous pouvez utiliser cette espace pour annoter les informations nécessaires au pilotage : élément contextuel, prochaine échéance, document à produire, point d'attention, élément relationnel avec la structure... Ces éléments ne seront pas communiqués aux structures et ne seront partagés qu'aux agents et agentes en charge. Veuillez préciser votre nom et la date de l’information pour un meilleur suivi."
      />
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
