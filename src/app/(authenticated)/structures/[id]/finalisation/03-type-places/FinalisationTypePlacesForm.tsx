"use client";

import FormWrapper from "@/app/components/forms/FormWrapper";
import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { finalisationTypePlacesSchema } from "./validation/finalisationTypePlacesSchema";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { FieldSetTypePlaces } from "@/app/components/forms/fieldsets/structure/FieldSetTypePlaces";
import { formatDate } from "@/app/utils/date.util";
import { FieldSetOuvertureFermeture } from "@/app/components/forms/fieldsets/structure/FieldSetOuvertureFermeture";
import { getCurrentStepData } from "@/app/(authenticated)/structures/[id]/finalisation/components/Steps";

export default function FinalisationTypePlacesForm({
  currentStep,
}: {
  currentStep: number;
}) {
  const { structure } = useStructureContext();
  const { nextRoute, previousRoute } = getCurrentStepData(
    currentStep,
    structure.id
  );

  const defaultValues = {
    typologies: structure?.structureTypologies?.map((typology) => ({
      nbPlaces: typology.nbPlaces,
      pmr: typology.pmr,
      lgbt: typology.lgbt,
      fvvTeh: typology.fvvTeh,
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

  return (
    <FormWrapper
      schema={finalisationTypePlacesSchema}
      nextRoute={nextRoute}
      defaultValues={defaultValues}
      submitButtonText="Étape suivante"
      previousStep={previousRoute}
      availableFooterButtons={["submit"]}
    >
      <InformationBar
        variant="warning"
        title="À vérifier"
        description="Veuillez vérifier les informations et/ou les documents suivants transmis par l’opérateur."
      />

      <FieldSetTypePlaces />
      <div>
        <InformationBar
          variant="info"
          title="À compléter"
          description="Veuillez remplir les champs obligatoires ci-dessous. Si une donnée vous est inconnue, contactez-nous."
        />

        <FieldSetOuvertureFermeture />
      </div>
    </FormWrapper>
  );
}
