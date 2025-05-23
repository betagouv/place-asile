import { Structure } from "@/types/structure.type";
import {
  AdressesFormValues,
  DocumentsSchemaFlexible,
  IdentificationFormValues,
  TypePlacesFormValues,
} from "../(password-protected)/ajout-structure/validation/validation";
import { DeepPartial } from "@/types/global";
import { Contact } from "@/types/contact.type";
import { Adresse } from "@/types/adresse.type";

export const useStructures = (): UseStructureResult => {
  const getStructures = async (): Promise<Structure[]> => {
    const result = await fetch("/api/structures");
    const structures = await result.json();
    return structures;
  };

  const handleDate = (date: string | undefined): string | null => {
    return date ? new Date(date).toISOString() : null;
  };

  const handleContacts = (
    contactPrincipal: Partial<Contact> | undefined,
    contactSecondaire: Partial<Contact> | undefined
  ): Partial<Contact>[] => {
    const contacts = [];
    if (contactPrincipal && Object.keys(contactPrincipal).length > 0) {
      contacts.push(contactPrincipal);
    }
    if (contactSecondaire && Object.keys(contactSecondaire).length > 0) {
      contacts.push(contactSecondaire);
    }
    return contacts;
  };

  const handleAdresses = (
    adresses: Partial<Adresse>[] | undefined
  ): Partial<Adresse>[] => {
    if (!adresses) {
      return [];
    }
    return adresses.map((adresse) => {
      return {
        ...adresse,
        typologies: [], // TODO add real values here
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
      creationDate: new Date(values.creationDate || "").toISOString(),
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
        pmr: Number(typologie.pmr),
        lgbt: Number(typologie.lgbt),
        fvvTeh: Number(typologie.fvvTeh),
        date: typologie.date,
      })),
      fileUploads: values.fileUploads?.filter((fileUpload) => fileUpload.key),
    };
  };

  const addStructure = async (values: FormValues): Promise<void> => {
    const structure = mapToStructure(values);
    const response = await fetch("/api/structures", {
      method: "POST",
      body: JSON.stringify(structure),
    });
    return response.json();
  };

  return { getStructures, addStructure };
};

type UseStructureResult = {
  getStructures: () => Promise<Structure[]>;
  addStructure: (values: FormValues) => Promise<void>;
};

type FormValues = Partial<
  IdentificationFormValues &
    AdressesFormValues &
    TypePlacesFormValues &
    DocumentsSchemaFlexible
>;
