"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { FieldSetAdresseAdministrative } from "@/app/components/forms/fieldsets/structure/FieldSetAdresseAdministrative";
import { FieldSetHebergement } from "@/app/components/forms/fieldsets/structure/FieldSetHebergement";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { useStructures } from "@/app/hooks/useStructures";
import { transformFormAdressesToApiAdresses } from "@/app/utils/adresse.util";
import { getYearFromDate } from "@/app/utils/date.util";
import { CURRENT_YEAR, PLACE_ASILE_CONTACT_EMAIL } from "@/constants";
import {
  AjoutAdressesFormValues,
  ajoutAdressesSchema,
} from "@/schemas/forms/ajout/ajoutAdresses.schema";
import {
  FormAdresse,
  FormAdresseTypologie,
} from "@/schemas/forms/base/adresse.schema";
import { Repartition } from "@/types/adresse.type";
import { FormKind } from "@/types/global";

import { AdressesRecoveryModal } from "./AdressesRecoveryModal";
import { AdressesRecoveryTypeBati } from "./AdressesRecoveryTypeBati";

export const AdressesRecovery = ({ dnaCode }: { dnaCode: string }) => {
  const [state, setState] = useState<"idle" | "error">("idle");
  const [backendError, setBackendError] = useState("");

  const router = useRouter();
  const { updateStructure } = useStructures();
  const { currentValue: localStorageValues } = useLocalStorage(
    `ajout-structure-${dnaCode}-adresses`,
    {} as AjoutAdressesFormValues
  );

  const formattedLocalStorageValues = useMemo(() => {
    return localStorageValues && Object.keys(localStorageValues).length > 0
      ? {
          ...localStorageValues,
          adresses: localStorageValues?.adresses?.map(
            (adresse: FormAdresse) => ({
              ...adresse,
              adresseTypologies: adresse.adresseTypologies?.map(
                (typologie: FormAdresseTypologie) => {
                  const typedTypologie = typologie as FormAdresseTypologie & {
                    date: string;
                  };
                  return {
                    ...typologie,
                    year:
                      typedTypologie.year ??
                      getYearFromDate(typedTypologie.date),
                  };
                }
              ),
            })
          ),
        }
      : {
          nom: "",
          adresseAdministrative: "",
          codePostalAdministratif: "",
          communeAdministrative: "",
          departementAdministratif: "",
          typeBati: undefined,
          adresses: [
            {
              adresseComplete: "",
              adresse: "",
              codePostal: "",
              commune: "",
              departement: "",
              repartition: Repartition.DIFFUS,
              adresseTypologies: [
                {
                  year: CURRENT_YEAR,
                  placesAutorisees: undefined as unknown as number,
                  logementSocial: false,
                  qpv: false,
                },
              ],
            },
          ],
        };
  }, [localStorageValues]);

  const numAdressesRecovered = useMemo(() => {
    return localStorageValues?.adresses?.length ?? 0;
  }, [localStorageValues]);

  const handleSubmit = async (data: AjoutAdressesFormValues) => {
    const result = await updateStructure({
      dnaCode,
      adresses: transformFormAdressesToApiAdresses(data.adresses, dnaCode),
      typeBati: data.typeBati,
      adresseAdministrative: data.adresseAdministrative,
      codePostalAdministratif: data.codePostalAdministratif,
      communeAdministrative: data.communeAdministrative,
      departementAdministratif: data.departementAdministratif,
    });

    if (result === "OK") {
      router.push(`/ajout-adresses/${dnaCode}/02-confirmation`);
    } else {
      setBackendError(result);
      setState("error");
    }
  };

  const getErrorEmail = (error: string): string => {
    const subject = "Problème avec le formulaire de Place d'asile";
    const body = `Bonjour,%0D%0A%0D%0AAjoutez ici des informations supplémentaires...%0D%0A%0D%0ARapport d'erreur: ${error}`;
    return `mailto:${PLACE_ASILE_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  // Needed to avoid hydration error
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }

  return (
    <>
      <FormWrapper
        schema={ajoutAdressesSchema}
        defaultValues={formattedLocalStorageValues}
        onSubmit={handleSubmit}
        mode="onChange"
        resetRoute={`/ajout-adresses/${dnaCode}/01-adresses`}
        submitButtonText="Valider"
        availableFooterButtons={[FooterButtonType.SUBMIT]}
      >
        <AdressesRecoveryTypeBati />
        <FieldSetHebergement formKind={FormKind.ADRESSES_RECOVERY} />
      </FormWrapper>
      {state === "error" && (
        <div className="flex items-end flex-col">
          <p className="text-default-error m-0">
            Une erreur s’est produite. Vos données restent sauvegardées dans le
            navigateur.
          </p>
          <p className="text-default-error">
            <a
              href={getErrorEmail(backendError)}
              className="underline"
              target="_blank"
            >
              Nous prévenir
            </a>
          </p>
        </div>
      )}
      <AdressesRecoveryModal numAdressesRecovered={numAdressesRecovered} />
    </>
  );
};
