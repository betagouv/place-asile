"use client";

import FormWrapper from "@/app/components/forms/FormWrapper";
import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { finalisationAdressesSchema } from "./validation/finalisationAdressesSchema";
import { InformationBar } from "@/app/components/ui/InformationBar";
import Notice from "@codegouvfr/react-dsfr/Notice";
import { FieldSetAdresseAdministrative } from "@/app/components/forms/fieldsets/structure/FieldSetAdresseAdministrative";
import { getCurrentStepData } from "@/app/(authenticated)/structures/[id]/finalisation/components/Steps";

export default function FinalisationAdressesForm({
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
    nom: structure.nom || "",
    adresseAdministrativeComplete: `${structure.adresseAdministrative} ${structure.codePostalAdministratif} ${structure.communeAdministrative} ${structure.departementAdministratif}`,
    adresseAdministrative: structure.adresseAdministrative || "",
    codePostalAdministratif: structure.codePostalAdministratif || "",
    communeAdministrative: structure.communeAdministrative || "",
    departementAdministratif: structure.departementAdministratif || "",
  };

  return (
    <FormWrapper
      schema={finalisationAdressesSchema}
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

      <Notice
        severity="info"
        title=""
        className="rounded [&_p]:flex  [&_p]:items-center"
        description="L’ensemble des adresses ne seront communiquées qu’aux agentes et agents en charge de cette politique publique."
      />
      <FieldSetAdresseAdministrative />
    </FormWrapper>
  );
}
