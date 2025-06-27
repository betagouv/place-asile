"use client";

import FormWrapper from "@/app/components/forms/FormWrapper";
import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureContext";
import { finalisationAdressesSchema } from "./validation/finalisationAdressesSchema";
import { InformationBar } from "@/app/components/ui/InformationBar";
import Notice from "@codegouvfr/react-dsfr/Notice";
import { FieldSetAdresseAdministrative } from "@/app/components/forms/fieldsets/structure/FieldSetAdresseAdministrative";

export default function FinalisationAdressesForm() {
  const { structure } = useStructureContext();

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
      nextRoute={`/structures/${structure.id}/finalisation/03-type-places`}
      defaultValues={defaultValues}
      submitButtonText="Étape suivante"
      previousStep={`/structures/${structure.id}/finalisation/01-identification`}
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
