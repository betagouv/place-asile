import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import {
  getCoordinates,
  transformFormAdressesToApiAdresses,
} from "@/app/utils/adresse.util";
import { transformAjoutFormContactsToApiContacts } from "@/app/utils/contacts.util";
import { formatDateToIsoString } from "@/app/utils/date.util";
import { StructureApiType } from "@/schemas/api/structure.schema";
import { AjoutAdressesFormValues } from "@/schemas/forms/ajout/ajoutAdresses.schema";
import { AjoutIdentificationFormValues } from "@/schemas/forms/ajout/ajoutIdentification.schema";
import { AjoutTypePlacesFormValues } from "@/schemas/forms/ajout/ajoutTypePlaces.schema";
import { DocumentsFinanciersFlexibleFormValues } from "@/schemas/forms/base/documentFinancier.schema";
import { DeepPartial } from "@/types/global";

dayjs.extend(customParseFormat);

export const useStructures = (): UseStructureResult => {
  const addStructure = async (values: AjoutFormValues): Promise<string> => {
    const structure = await transformAjoutFormStructureToApiStructure(values);
    try {
      const response = await fetch("/api/structures", {
        method: "POST",
        body: JSON.stringify(structure),
      });
      if (response.status < 400) {
        return "OK";
      } else {
        const result = await response.json();
        return JSON.stringify(result);
      }
    } catch (error) {
      console.error(error);
      return String(error);
    }
  };

  const updateStructure = async (structure: unknown): Promise<string> => {
    try {
      const response = await fetch("/api/structures", {
        method: "PUT",
        body: JSON.stringify(structure),
      });
      if (response.status < 400) {
        return "OK";
      } else {
        const result = await response.json();
        return JSON.stringify(result);
      }
    } catch (error) {
      console.error(error);
      throw new Error(error?.toString());
    }
  };

  const updateAndRefreshStructure = async (
    structureId: number,
    structure: unknown,
    setStructure: (structure: StructureApiType) => void
  ): Promise<string> => {
    const result = await updateStructure(structure);
    if (result === "OK") {
      const res = await fetch(`/api/structures/${structureId}`);
      const updatedStructure = await res.json();
      setStructure(updatedStructure);
    }
    return result;
  };

  return {
    addStructure,
    updateStructure,
    updateAndRefreshStructure,
  };
};

type UseStructureResult = {
  addStructure: (values: AjoutFormValues) => Promise<string>;
  updateStructure: (values: unknown) => Promise<string>;
  updateAndRefreshStructure: (
    structureId: number,
    values: unknown,
    setStructure: (structure: StructureApiType) => void
  ) => Promise<string>;
};

const transformAjoutFormStructureToApiStructure = async (
  values: AjoutFormValues
): Promise<DeepPartial<StructureApiType>> => {
  const fullAdress = `${values.adresseAdministrative}, ${values.codePostalAdministratif} ${values.communeAdministrative}`;
  const coordinates = await getCoordinates(fullAdress);

  return {
    dnaCode: values.dnaCode,
    operateur: values.operateur,
    filiale: values.filiale,
    type: values.type,
    adresseAdministrative: values.adresseAdministrative,
    codePostalAdministratif: values.codePostalAdministratif,
    communeAdministrative: values.communeAdministrative,
    departementAdministratif: values.departementAdministratif,
    latitude: coordinates.latitude?.toString(),
    longitude: coordinates.longitude?.toString(),
    nom: values.nom,
    debutConvention: formatDateToIsoString(values.debutConvention),
    finConvention: formatDateToIsoString(values.finConvention),
    creationDate: formatDateToIsoString(values.creationDate, true) as string,
    date303: values.date303 ? formatDateToIsoString(values.date303) : undefined,
    finessCode: values.finessCode,
    lgbt: values.lgbt,
    fvvTeh: values.fvvTeh,
    public: values.public,
    debutPeriodeAutorisation: formatDateToIsoString(
      values.debutPeriodeAutorisation
    ),
    finPeriodeAutorisation: formatDateToIsoString(
      values.finPeriodeAutorisation
    ),
    adresses: transformFormAdressesToApiAdresses(
      values.adresses,
      values.dnaCode
    ),
    contacts: transformAjoutFormContactsToApiContacts(
      values.contactPrincipal,
      values.contactSecondaire
    ),
    structureMillesimes:
      values.structureMillesimes?.map((millesime) => ({
        ...millesime,
        date: formatStructureMillesimeDateToIsoString(millesime.date),
        operateurComment: millesime.operateurComment ?? undefined,
      })) || undefined,
    structureTypologies: values.typologies?.map((typologie) => ({
      ...typologie,
      placesAutorisees: Number(
        String(typologie.placesAutorisees).replace(",", ".").replaceAll(" ", "")
      ),
      pmr: Number(String(typologie.pmr).replace(",", ".").replaceAll(" ", "")),
      lgbt: Number(
        String(typologie.lgbt).replace(",", ".").replaceAll(" ", "")
      ),
      fvvTeh: Number(
        String(typologie.fvvTeh).replace(",", ".").replaceAll(" ", "")
      ),
      date: formatDateToIsoString(typologie.date) as string,
    })),
    documentsFinanciers:
      values.documentsFinanciers?.filter(
        (documentFinancier) => documentFinancier.key
      ) ?? [],
  };
};

export type AjoutFormValues = Partial<
  AjoutIdentificationFormValues &
    AjoutAdressesFormValues &
    AjoutTypePlacesFormValues &
    DocumentsFinanciersFlexibleFormValues
>;

// TODO: This function is temporary. It should be deleted by 15/12/2025
const formatStructureMillesimeDateToIsoString = (date: string): string => {
  // If the input is already a valid ISO string, just return it
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(date)) {
    return date;
  }
  // Otherwise, assume it's a year (e.g., "2025")
  return new Date(Number(date), 0, 1, 13).toISOString();
};
