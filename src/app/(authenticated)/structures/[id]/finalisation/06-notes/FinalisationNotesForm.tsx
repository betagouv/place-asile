import Notice from "@codegouvfr/react-dsfr/Notice";
import { useRouter } from "next/navigation";
import { ReactElement, useState } from "react";

import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useStructures } from "@/app/hooks/useStructures";
import { StructureState } from "@/types/structure.type";

import { useStructureContext } from "../../context/StructureClientContext";
import { getCurrentStepData } from "../components/Steps";
import { FieldSetNotes } from "./FieldSetNotes";
import { finalisationNotesSchema } from "./validation/finalisationNotesSchema";

export const FinalisationNotesForm = ({ currentStep }: Props): ReactElement => {
  const { structure, setStructure } = useStructureContext();

  const { previousRoute } = getCurrentStepData(currentStep, structure.id);

  const defaultValues = {
    notes: structure.notes,
  };

  const { updateAndRefreshStructure } = useStructures();
  const router = useRouter();

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [backendError, setBackendError] = useState<string | undefined>("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    setState("loading");
    const updatedStructure = await updateAndRefreshStructure(
      structure.id,
      {
        ...data,
        dnaCode: structure.dnaCode,
        state: StructureState.FINALISE,
      },
      setStructure
    );
    if (updatedStructure === "OK") {
      router.push(`${process.env.NEXT_PUBLIC_URL}/structures/${structure.id}`);
    } else {
      setState("error");
      setBackendError(updatedStructure?.toString());
      throw new Error(updatedStructure?.toString());
    }
  };
  return (
    <FormWrapper
      schema={finalisationNotesSchema}
      onSubmit={handleSubmit}
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
