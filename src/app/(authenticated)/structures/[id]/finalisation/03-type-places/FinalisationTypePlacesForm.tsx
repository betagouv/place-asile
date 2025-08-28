"use client";

import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { finalisationTypePlacesSchema } from "./validation/finalisationTypePlacesSchema";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { FieldSetTypePlaces } from "@/app/components/forms/fieldsets/structure/FieldSetTypePlaces";
import { formatDate } from "@/app/utils/date.util";
import { FieldSetOuvertureFermeture } from "@/app/components/forms/fieldsets/structure/FieldSetOuvertureFermeture";
import { getCurrentStepData } from "@/app/(authenticated)/structures/[id]/finalisation/components/Steps";
import { SubmitError } from "@/app/components/SubmitError";
import { useStructures } from "@/app/hooks/useStructures";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StructureState } from "@/types/structure.type";

export default function FinalisationTypePlacesForm({
  currentStep,
}: {
  currentStep: number;
}) {
  const { structure, setStructure } = useStructureContext();
  const { nextRoute, previousRoute } = getCurrentStepData(
    currentStep,
    structure.id
  );

  const defaultValues = {
    typologies: structure?.structureTypologies?.map((typologie) => ({
      id: typologie.id,
      date: typologie.date,
      placesAutorisees: typologie.placesAutorisees,
      pmr: typologie.pmr,
      lgbt: typologie.lgbt,
      fvvTeh: typologie.fvvTeh,
    })),
    placesACreer: structure.placesACreer ?? undefined,
    placesAFermer: structure.placesAFermer ?? undefined,
    echeancePlacesACreer: structure.echeancePlacesACreer
      ? formatDate(structure.echeancePlacesACreer)
      : undefined,
    echeancePlacesAFermer: structure.echeancePlacesAFermer
      ? formatDate(structure.echeancePlacesAFermer)
      : undefined,
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
      },
      setStructure
    );
    if (updatedStructure === "OK") {
      router.push(nextRoute);
    } else {
      setState("error");
      setBackendError(updatedStructure?.toString());
      throw new Error(updatedStructure?.toString());
    }
  };

  return (
    <FormWrapper
      schema={finalisationTypePlacesSchema}
      onSubmit={handleSubmit}
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

      <FieldSetTypePlaces />

      <div>
        {structure.state === StructureState.A_FINALISER && (
          <InformationBar
            variant="info"
            title="À compléter"
            description="Veuillez remplir les champs obligatoires ci-dessous. Si une donnée vous est inconnue, contactez-nous."
          />
        )}
        <FieldSetOuvertureFermeture />
      </div>

      {state === "error" && (
        <SubmitError
          structureDnaCode={structure.dnaCode}
          backendError={backendError}
        />
      )}
    </FormWrapper>
  );
}
