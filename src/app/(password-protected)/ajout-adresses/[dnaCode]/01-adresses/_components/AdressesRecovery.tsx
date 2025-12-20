"use client";

import { useMemo } from "react";

import { FieldSetAdresseAdministrative } from "@/app/components/forms/fieldsets/structure/FieldSetAdresseAdministrative";
import { FieldSetHebergement } from "@/app/components/forms/fieldsets/structure/FieldSetHebergement";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { useStructures } from "@/app/hooks/useStructures";
import { transformFormAdressesToApiAdresses } from "@/app/utils/adresse.util";
import {
  AjoutAdressesFormValues,
  ajoutAdressesSchema,
} from "@/schemas/forms/ajout/ajoutAdresses.schema";
import { FormKind } from "@/types/global";

import { AdressesRecoveryModal } from "./AdressesRecoveryModal";

export const AdressesRecovery = ({ dnaCode }: { dnaCode: string }) => {
  const { updateStructure } = useStructures();
  const { currentValue: localStorageValues } = useLocalStorage(
    `ajout-structure-${dnaCode}-adresses`,
    {} as AjoutAdressesFormValues
  );

  const numAdressesRecovered = useMemo(() => {
    return localStorageValues?.adresses?.length ?? 0;
  }, [localStorageValues]);

  const handleSubmit = async (data: AjoutAdressesFormValues) => {
    await updateStructure({
      dnaCode,
      adresses: transformFormAdressesToApiAdresses(data.adresses, dnaCode),
      typeBati: data.typeBati,
      adresseAdministrative: data.adresseAdministrative,
      codePostalAdministratif: data.codePostalAdministratif,
      communeAdministrative: data.communeAdministrative,
      departementAdministratif: data.departementAdministratif,
    });
  };

  return (
    <>
      <FormWrapper
        schema={ajoutAdressesSchema}
        defaultValues={localStorageValues}
        onSubmit={handleSubmit}
        mode="onChange"
        resetRoute={`/ajout-adresses/${dnaCode}/01-adresses`}
        submitButtonText="Valider"
        availableFooterButtons={[FooterButtonType.SUBMIT]}
      >
        <FieldSetAdresseAdministrative formKind={FormKind.MODIFICATION} />
        <hr />
        <FieldSetHebergement />
      </FormWrapper>
      <AdressesRecoveryModal numAdressesRecovered={numAdressesRecovered} />
    </>
  );
};
