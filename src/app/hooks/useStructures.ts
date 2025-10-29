import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { transformFormAdressesToApiAdresses } from "@/app/utils/adresse.util";
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
  const getStructures = async (): Promise<StructureApiType[]> => {
    const result = await fetch("/api/structures");
    const structures = await result.json();
    return structures;
  };

  const addStructure = async (values: AjoutFormValues): Promise<string> => {
    const structure = transformAjoutFormStructureToApiStructure(values);
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
    getStructures,
    addStructure,
    updateStructure,
    updateAndRefreshStructure,
  };
};

type UseStructureResult = {
  getStructures: () => Promise<StructureApiType[]>;
  addStructure: (values: AjoutFormValues) => Promise<string>;
  updateStructure: (values: unknown) => Promise<string>;
  updateAndRefreshStructure: (
    structureId: number,
    values: unknown,
    setStructure: (structure: StructureApiType) => void
  ) => Promise<string>;
};

const transformAjoutFormStructureToApiStructure = (
  values: AjoutFormValues
): DeepPartial<StructureApiType> => {
  return {
    dnaCode: values.dnaCode,
    operateur: values.operateur,
    filiale: values.filiale,
    type: values.type,
    adresseAdministrative: values.adresseAdministrative,
    codePostalAdministratif: values.codePostalAdministratif,
    communeAdministrative: values.communeAdministrative,
    departementAdministratif: values.departementAdministratif,
    nom: values.nom,
    debutConvention: formatDateToIsoString(values.debutConvention),
    finConvention: formatDateToIsoString(values.finConvention),
    cpom: values.cpom,
    creationDate: formatDateToIsoString(values.creationDate, true) as string,
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
    debutCpom: formatDateToIsoString(values.debutCpom),
    finCpom: formatDateToIsoString(values.finCpom),
    adresses: transformFormAdressesToApiAdresses(
      values.adresses,
      values.dnaCode
    ),
    contacts: transformAjoutFormContactsToApiContacts(
      values.contactPrincipal,
      values.contactSecondaire
    ),
    structureTypologies: values.typologies?.map((typologie) => ({
      ...typologie,
      placesAutorisees: Number(typologie.placesAutorisees),
      pmr: Number(typologie.pmr),
      lgbt: Number(typologie.lgbt),
      fvvTeh: Number(typologie.fvvTeh),
      date: formatDateToIsoString(typologie.date) as string,
    })),
    documentsFinanciers: values.documentsFinanciers?.filter((documentFinancier) => documentFinancier.key),
  };
};

export type AjoutFormValues = Partial<
  AjoutIdentificationFormValues &
    AjoutAdressesFormValues &
    AjoutTypePlacesFormValues &
    DocumentsFinanciersFlexibleFormValues
>;
