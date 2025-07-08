import { ReactElement, useState } from "react";
import { useStructureContext } from "../../context/StructureClientContext";
import { getCurrentStepData } from "../components/Steps";
import { useStructures } from "@/app/hooks/useStructures";
import { useRouter } from "next/navigation";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { finalisationNotesSchema } from "./validation/finalisationNotesSchema";
import Notice from "@codegouvfr/react-dsfr/Notice";
import { SubmitError } from "@/app/components/SubmitError";
import { FieldSetNotes } from "./FieldSetNotes";

export const FinalisationNotesForm = ({ currentStep }: Props): ReactElement => {
  const { structure } = useStructureContext();

  const { previousRoute } = getCurrentStepData(currentStep, structure.id);

  const defaultValues = {
    notes: structure.notes,
  };

  const { updateStructure } = useStructures();
  const router = useRouter();

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [backendError, setBackendError] = useState<string | undefined>("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    setState("loading");
    const updatedStructure = await updateStructure({
      ...data,
      dnaCode: structure.dnaCode,
    });
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
      <InformationBar
        variant="info"
        title="À compléter"
        description="Veuillez remplir les champs obligatoires ci-dessous. Si une donnée vous est inconnue, contactez-nous."
      />

      <Notice
        severity="info"
        title=""
        className="rounded [&_p]:flex  [&_p]:items-center"
        description="Afin de centraliser toutes les données concernant cette structure, vous pouvez utiliser cette espace pour annoter les informations nécessaires au pilotage : élément contextuel, prochaine échéance, document à produire, point d'attention, élément relationnel avec la structure... Ces éléments ne seront pas communiqués aux structures et ne seront partagés qu'aux agents et agentes en charge."
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
