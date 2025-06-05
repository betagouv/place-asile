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
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FormAdresse } from "../utils/adresse.util";
import { FileUploadCategory } from "@prisma/client";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isFileUploadCategory = (value: any): value is FileUploadCategory => {
    return Object.values(FileUploadCategory).includes(value);
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
        pmr: Number(typologie.pmr),
        lgbt: Number(typologie.lgbt),
        fvvTeh: Number(typologie.fvvTeh),
        date: typologie.date,
      })),
      fileUploads: values.fileUploads
        ?.filter((fileUpload) => fileUpload.key)
        .map((fileUpload) => ({
          ...fileUpload,
          category: isFileUploadCategory(fileUpload.category)
            ? fileUpload.category
            : undefined,
        })),
    };
  };

  const addStructure = async (values: FormValues): Promise<boolean> => {
    const structure = mapToStructure(values);
    try {
      const response = await fetch("/api/structures", {
        method: "POST",
        body: JSON.stringify(structure),
      });
      return response.status < 400;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return { getStructures, addStructure };
};

type UseStructureResult = {
  getStructures: () => Promise<Structure[]>;
  addStructure: (values: FormValues) => Promise<boolean>;
};

type FormValues = Partial<
  IdentificationFormValues &
    AdressesFormValues &
    TypePlacesFormValues &
    DocumentsSchemaFlexible
>;
