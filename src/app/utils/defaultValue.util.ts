import { Repartition } from "@/types/adresse.type";
import { StructureWithLatLng } from "@/types/structure.type";
import { PublicType } from "@/types/structure.type";

import { formatDateString } from "./date.util";
import { isStructureAutorisee } from "./structure.util";

export const getDefaultValues = ({
  structure,
  type,
}: {
  structure: StructureWithLatLng;
  type:
    | "identification"
    | "description"
    | "type"
    | "qualite"
    | "documents"
    | "verification";
}) => {
  const isAutorisee = isStructureAutorisee(structure.type);

  if (type === "description") {
    return {
      dnaCode: structure.dnaCode,
      type: structure.type,
      operateur: structure.operateur!,
      creationDate: formatDateString(structure.creationDate),
      finessCode: structure.finessCode || undefined,
      public: structure.public
        ? PublicType[structure.public as string as keyof typeof PublicType]
        : undefined,
      filiale: structure.filiale || undefined,
      contacts: structure.contacts || [],
      nom: structure.nom ?? "",
      adresseAdministrativeComplete: `${structure.adresseAdministrative} ${structure.codePostalAdministratif} ${structure.communeAdministrative} ${structure.departementAdministratif}`,
      adresseAdministrative: structure.adresseAdministrative || "",
      codePostalAdministratif: structure.codePostalAdministratif || "",
      communeAdministrative: structure.communeAdministrative || "",
      departementAdministratif: structure.departementAdministratif || "",
      typeBati:
        (structure as { typeBati?: Repartition }).typeBati || Repartition.MIXTE,
      cpom: structure.cpom,
      lgbt: structure.lgbt,
      fvvTeh: structure.fvvTeh,
    };
  }

  if (type === "identification") {
    return {
      dnaCode: structure.dnaCode,
      type: structure.type,
      operateur: structure.operateur!,
      creationDate: formatDateString(structure.creationDate),
      debutPeriodeAutorisation: isAutorisee
        ? formatDateString(structure.debutPeriodeAutorisation)
        : undefined,
      finPeriodeAutorisation: isAutorisee
        ? formatDateString(structure.finPeriodeAutorisation)
        : undefined,
      debutConvention: formatDateString(structure.debutConvention),
      finConvention: formatDateString(structure.finConvention),
      debutCpom: formatDateString(structure.debutCpom),
      finCpom: formatDateString(structure.finCpom),
      echeancePlacesACreer: structure.echeancePlacesACreer,
      echeancePlacesAFermer: structure.echeancePlacesAFermer,
      contacts: structure.contacts || [],
      finessCode: structure.finessCode || undefined,
      public: structure.public
        ? PublicType[structure.public as string as keyof typeof PublicType]
        : undefined,
      filiale: structure.filiale || undefined,
    };
  }
  return {
    dnaCode: structure.dnaCode,
    type: structure.type,
    operateur: structure.operateur!,
    creationDate: formatDateString(structure.creationDate),
    debutPeriodeAutorisation: isAutorisee
      ? formatDateString(structure.debutPeriodeAutorisation)
      : undefined,
    finPeriodeAutorisation: isAutorisee
      ? formatDateString(structure.finPeriodeAutorisation)
      : undefined,
    debutConvention: formatDateString(structure.debutConvention),
    finConvention: formatDateString(structure.finConvention),
    debutCpom: formatDateString(structure.debutCpom),
    finCpom: formatDateString(structure.finCpom),
    echeancePlacesACreer: structure.echeancePlacesACreer,
    echeancePlacesAFermer: structure.echeancePlacesAFermer,
    contacts: structure.contacts || [],
    finessCode: structure.finessCode || undefined,
    public: structure.public
      ? PublicType[structure.public as string as keyof typeof PublicType]
      : undefined,
    filiale: structure.filiale || undefined,
  };
};
