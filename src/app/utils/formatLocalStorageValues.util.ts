import { StructureMillesimeApiType } from "@/schemas/api/structure-millesime.schema";
import { AjoutAdressesFormValues } from "@/schemas/forms/ajout/ajoutAdresses.schema";
import { AjoutTypePlacesFormValues } from "@/schemas/forms/ajout/ajoutTypePlaces.schema";
import {
  FormAdresse,
  FormAdresseTypologie,
} from "@/schemas/forms/base/adresse.schema";
import { DocumentsFinanciersFlexibleFormValues } from "@/schemas/forms/base/documentFinancier.schema";
import { StructureTypologieWithoutEvolutionSchemaTypeFormValues } from "@/schemas/forms/base/structureTypologie.schema";

import { getYearFromDate } from "./date.util";

export const formatLocalStorageValues = (
  localStorageValues:
    | Partial<AjoutTypePlacesFormValues>
    | Partial<AjoutAdressesFormValues>
    | Partial<AjoutTypePlacesFormValues>
    | Partial<DocumentsFinanciersFlexibleFormValues>
    | undefined,
  key: "identification" | "type-places" | "adresses" | "documents"
) => {
  if (!localStorageValues) {
    return localStorageValues;
  }
  if (key === "type-places") {
    const typePlacesValues = localStorageValues as Partial<AjoutTypePlacesFormValues>;
    if (!typePlacesValues.typologies) {
      return typePlacesValues;
    }
    return {
      ...typePlacesValues,
      typologies: typePlacesValues.typologies.map(
        (typology: StructureTypologieWithoutEvolutionSchemaTypeFormValues) => {
          const typedTypology =
            typology as StructureTypologieWithoutEvolutionSchemaTypeFormValues & {
              date: string;
            };
          return {
            ...typedTypology,
            year: typedTypology.year ?? getYearFromDate(typedTypology.date),
            placesAutorisees: typedTypology.placesAutorisees || undefined,
          };
        }
      ),
    }
  }
  if (key === "adresses") {
    const adressesValues = localStorageValues as AjoutAdressesFormValues;
    return {
      ...adressesValues,
      adresses: adressesValues.adresses.map((adresse: FormAdresse) => ({
        ...adresse,
        adresseTypologies: adresse.adresseTypologies?.map(
          (typologie: FormAdresseTypologie) => {
            const typedTypologie = typologie as FormAdresseTypologie & {
              date: string;
            };
            return {
              ...typedTypologie,
              year: typedTypologie.year ?? getYearFromDate(typedTypologie.date),
              placesAutorisees: typedTypologie.placesAutorisees || undefined,
            };
          }
        ),
      })),
    };
  }
  if (key === "documents") {
    const documentsValues =
      localStorageValues as DocumentsFinanciersFlexibleFormValues;
    return {
      ...documentsValues,
      documents: documentsValues.structureMillesimes?.map(
        (millesime: StructureMillesimeApiType) => {
          const typedMillesime = millesime as StructureMillesimeApiType & {
            date: string;
          };
          return {
            ...typedMillesime,
            year: typedMillesime.year ?? getYearFromDate(typedMillesime.date),
          };
        }
      ),
    };
  }
  return localStorageValues;
};
