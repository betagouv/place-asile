import { getRepartition } from "@/app/utils/structure.util";
import { ContactApiType } from "@/schemas/api/contact.schema";
import { StructureApiType } from "@/schemas/api/structure.schema";
import { StructureTypologieApiType } from "@/schemas/api/structure-typologie.schema";
import { ActeAdministratifFormValues } from "@/schemas/forms/base/acteAdministratif.schema";
import { FormAdresse } from "@/schemas/forms/base/adresse.schema";
import { ControleFormValues } from "@/schemas/forms/base/controles.schema";
import { DocumentFinancierFlexibleFormValues } from "@/schemas/forms/base/documentFinancier.schema";
import { EvaluationFormValues } from "@/schemas/forms/base/evaluation.schema";
import { budgetsSchemaTypeFormValues } from "@/schemas/forms/base/budget.schema";
import { Repartition } from "@/types/adresse.type";
import { PublicType } from "@/types/structure.type";

import { getActesAdministratifsDefaultValues } from "./acteAdministratif.util";
import { transformApiAdressesToFormAdresses } from "./adresse.util";
import { getBudgetsDefaultValues } from "./budget.util";
import { getControlesDefaultValues } from "./controle.util";
import { getDocumentsFinanciersDefaultValues } from "./documentFinancier.util";
import { getEvaluationsDefaultValues } from "./evaluations.util";
import { isStructureAutorisee } from "./structure.util";

export const getDefaultValues = ({
  structure,
}: {
  structure: StructureApiType;
}): Partial<StructureDefaultValues> => {
  const isAutorisee = isStructureAutorisee(structure.type);
  const repartition = getRepartition(structure);

  const budgets = getBudgetsDefaultValues(structure?.budgets || []);

  const actesAdministratifs = getActesAdministratifsDefaultValues(structure);
  const documentsFinanciers = getDocumentsFinanciersDefaultValues({
    structure,
    isAutorisee,
  });

  const controles = getControlesDefaultValues(structure.controles);
  const evaluations = getEvaluationsDefaultValues(structure.evaluations);

  return {
    ...structure,
    nom: structure.nom ?? "",
    operateur: structure.operateur ?? undefined,
    creationDate: structure.creationDate ?? "",
    debutPeriodeAutorisation: isAutorisee
      ? (structure.debutPeriodeAutorisation ?? undefined)
      : undefined,
    finPeriodeAutorisation: isAutorisee
      ? (structure.finPeriodeAutorisation ?? undefined)
      : undefined,
    debutConvention: structure.debutConvention ?? undefined,
    finConvention: structure.finConvention ?? undefined,
    debutCpom: structure.debutCpom ?? undefined,
    finCpom: structure.finCpom ?? undefined,
    finessCode: structure.finessCode || undefined,
    public: structure.public
      ? PublicType[structure.public as string as keyof typeof PublicType]
      : undefined,
    filiale: structure.filiale || undefined,
    contacts: structure.contacts || [],
    adresseAdministrativeComplete: [
      structure.adresseAdministrative,
      structure.codePostalAdministratif,
      structure.communeAdministrative,
      structure.departementAdministratif,
    ]
      .filter(Boolean)
      .join(" "),
    adresseAdministrative: structure.adresseAdministrative || "",
    codePostalAdministratif: structure.codePostalAdministratif || "",
    communeAdministrative: structure.communeAdministrative || "",
    departementAdministratif: structure.departementAdministratif || "",
    typeBati: repartition,
    adresses: transformApiAdressesToFormAdresses(structure.adresses),
    typologies: structure?.structureTypologies?.map((typologie) => ({
      id: typologie.id,
      date: typologie.date,
      placesAutorisees: typologie.placesAutorisees,
      pmr: typologie.pmr,
      lgbt: typologie.lgbt,
      fvvTeh: typologie.fvvTeh,
    })),
    placesACreer: structure.placesACreer ?? undefined,
    placesAFermer: structure.placesAFermer ?? undefined,
    echeancePlacesACreer: structure.echeancePlacesACreer ?? undefined,
    echeancePlacesAFermer: structure.echeancePlacesAFermer ?? undefined,
    budgets,
    documentsFinanciers,
    actesAdministratifs,
    controles,
    evaluations,
  };
};

type StructureDefaultValues = Omit<
  StructureApiType,
  | "creationDate"
  | "nom"
  | "debutPeriodeAutorisation"
  | "finPeriodeAutorisation"
  | "debutConvention"
  | "finConvention"
  | "debutCpom"
  | "finCpom"
  | "finessCode"
  | "public"
  | "filiale"
  | "contacts"
  | "adresseAdministrativeComplete"
  | "adresseAdministrative"
  | "codePostalAdministratif"
  | "communeAdministrative"
  | "departementAdministratif"
  | "typologies"
  | "adresses"
  | "placesACreer"
  | "placesAFermer"
  | "echeancePlacesACreer"
  | "echeancePlacesAFermer"
  | "actesAdministratifs"
  | "documentsFinanciers"
  | "controles"
  | "evaluations"
  | "budgets"
> & {
  creationDate: string;
  nom: string;
  debutPeriodeAutorisation?: string;
  finPeriodeAutorisation?: string;
  debutConvention?: string;
  finConvention?: string;
  debutCpom?: string;
  finCpom?: string;
  finessCode?: string;
  public?: PublicType;
  filiale?: string;
  contacts: ContactApiType[];
  adresseAdministrativeComplete: string;
  adresseAdministrative: string;
  codePostalAdministratif: string;
  communeAdministrative: string;
  departementAdministratif: string;
  typeBati: Repartition;
  adresses: FormAdresse[];
  typologies?: StructureTypologieApiType[];
  placesACreer?: number;
  placesAFermer?: number;
  echeancePlacesACreer?: string;
  echeancePlacesAFermer?: string;
  documentsFinanciers: DocumentFinancierFlexibleFormValues[];
  actesAdministratifs: ActeAdministratifFormValues[];
  controles: ControleFormValues[];
  evaluations: EvaluationFormValues[];
  budgets: budgetsSchemaTypeFormValues;
};
