import { Structure } from "@/types/structure.type";
import { DeepPartial } from "@/types/global";
import { Contact } from "@/types/contact.type";
import { Adresse } from "@/types/adresse.type";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FormAdresse } from "../utils/adresse.util";
import { IdentificationFormValues } from "../(password-protected)/ajout-structure/validation/identificationSchema";
import { TypePlacesFormValues } from "../(password-protected)/ajout-structure/validation/typePlacesSchema";
import { AdressesFormValues } from "../(password-protected)/ajout-structure/validation/adressesSchema";
import { DocumentsSchemaFlexible } from "../(password-protected)/ajout-structure/validation/documentsSchema";

dayjs.extend(customParseFormat);

export const useStructures = (): UseStructureResult => {
  const getStructures = async (): Promise<Structure[]> => {
    const result = await fetch("/api/structures");
    const structures = await result.json();
    return structures;
  };

  const handleDate = (date: string | undefined): string | null => {
    return date ? dayjs(date, "DD/MM/YYYY").toISOString() : null;
  };

  const handleContacts = (
    contactPrincipal: Partial<Contact> | undefined,
    contactSecondaire: Partial<Contact> | undefined
  ): Partial<Contact>[] => {
    const contacts: Partial<Contact>[] = [];

    if (contactPrincipal) {
      contacts.push(contactPrincipal);
    }

    if (
      contactSecondaire &&
      contactSecondaire.prenom &&
      contactSecondaire.prenom.trim() !== "" &&
      contactSecondaire.nom &&
      contactSecondaire.nom.trim() !== "" &&
      contactSecondaire.email &&
      contactSecondaire.email.trim() !== "" &&
      contactSecondaire.telephone &&
      contactSecondaire.telephone.trim() !== "" &&
      contactSecondaire.role &&
      contactSecondaire.role.trim() !== ""
    ) {
      contacts.push(contactSecondaire);
    }

    return contacts;
  };

  const handleAdresses = (
    adresses: Partial<FormAdresse>[] | undefined
  ): DeepPartial<Adresse>[] => {
    if (!adresses) {
      return [];
    }
    return adresses
      .filter(
        (adresse) =>
          adresse.adresse !== "" &&
          adresse.codePostal !== "" &&
          adresse.commune !== ""
      )
      .map((adresse) => {
        return {
          adresse: adresse.adresse,
          codePostal: adresse.codePostal,
          commune: adresse.commune,
          repartition: adresse.repartition,
          typologies: [
            {
              nbPlacesTotal: Number(adresse.places),
              date: new Date().toISOString(),
              qpv: adresse.qpv ? Number(adresse.places) : 0,
              logementSocial: adresse.logementSocial
                ? Number(adresse.places)
                : 0,
            },
          ],
        };
      });
  };

  const mapToStructure = (values: FormValues): DeepPartial<Structure> => {
    return {
      dnaCode: values.dnaCode,
      operateur: values.operateur,
      filiale: values.filiale,
      type: values.type,
      nbPlaces: Number(values.typologies?.[0].autorisees),
      adresseAdministrative: values.adresseAdministrative,
      codePostalAdministratif: values.codePostalAdministratif,
      communeAdministrative: values.communeAdministrative,
      departementAdministratif: values.departementAdministratif,
      nom: values.nom,
      debutConvention: handleDate(values.debutConvention),
      finConvention: handleDate(values.finConvention),
      cpom: values.cpom,
      creationDate: dayjs(
        values.creationDate || "",
        "DD/MM/YYYY"
      ).toISOString(),
      finessCode: values.finessCode,
      lgbt: values.lgbt,
      fvvTeh: values.fvvTeh,
      public: values.public,
      debutPeriodeAutorisation: handleDate(values.debutPeriodeAutorisation),
      finPeriodeAutorisation: handleDate(values.finPeriodeAutorisation),
      debutCpom: handleDate(values.debutCpom),
      finCpom: handleDate(values.finCpom),
      adresses: handleAdresses(values.adresses),
      contacts: handleContacts(
        values.contactPrincipal,
        values.contactSecondaire
      ),
      typologies: values.typologies?.map((typologie) => ({
        ...typologie,
        autorisees: Number(typologie.autorisees),
        pmr: Number(typologie.pmr),
        lgbt: Number(typologie.lgbt),
        fvvTeh: Number(typologie.fvvTeh),
        date: typologie.date,
      })),
      fileUploads: values.fileUploads?.filter((fileUpload) => fileUpload.key),
    };
  };

  const addStructure = async (values: FormValues): Promise<string> => {
    const structure = mapToStructure(values);
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

  const updateStructure = async (values: unknown): Promise<string> => {
    try {
      const response = await fetch("/api/structures", {
        method: "PUT",
        body: JSON.stringify(values),
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
    values: unknown,
    setStructure: (structure: Structure) => void
  ): Promise<string> => {
    const result = await updateStructure(values);
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
  getStructures: () => Promise<Structure[]>;
  addStructure: (values: FormValues) => Promise<string>;
  updateStructure: (values: unknown) => Promise<string>;
  updateAndRefreshStructure: (
    structureId: number,
    values: unknown,
    setStructure: (structure: Structure) => void
  ) => Promise<string>;
};

type FormValues = Partial<
  IdentificationFormValues &
    AdressesFormValues &
    TypePlacesFormValues &
    DocumentsSchemaFlexible
>;
