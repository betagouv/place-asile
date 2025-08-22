import {
  Adresse,
  ControleType,
  FileUploadCategory,
  PublicType,
  Repartition,
  StructureType,
} from "@prisma/client";
import { CreateAdresse, CreateAdresseTypologie } from "./structure.types";
import z from "zod";
import { parseFrDate } from "@/app/utils/date.util";

export const convertToRepartition = (repartition: string): Repartition => {
  const repartitions: Record<string, Repartition> = {
    Diffus: Repartition.DIFFUS,
    Collectif: Repartition.COLLECTIF,
    Mixte: Repartition.MIXTE,
  };
  return repartitions[repartition.trim()];
};

export const convertToPublicType = (
  typePublic: string | null | undefined
): PublicType => {
  if (!typePublic) return PublicType.TOUT_PUBLIC;

  const typesPublic: Record<string, PublicType> = {
    "tout public": PublicType.TOUT_PUBLIC,
    famille: PublicType.FAMILLE,
    "personnes isolées": PublicType.PERSONNES_ISOLEES,
  };
  return typesPublic[typePublic.trim().toLowerCase()];
};

export const convertToStructureType = (
  structureType: string
): StructureType => {
  const typesStructures: Record<string, StructureType> = {
    CADA: StructureType.CADA,
    HUDA: StructureType.HUDA,
    CPH: StructureType.CPH,
    CAES: StructureType.CAES,
    PRAHDA: StructureType.PRAHDA,
  };
  return typesStructures[structureType.trim()];
};

export const convertToControleType = (controleType: string): ControleType => {
  const typesControles: Record<string, ControleType> = {
    Inopiné: ControleType.INOPINE,
    Programmé: ControleType.PROGRAMME,
  };
  return typesControles[controleType.trim()];
};

export const convertToFileUploadCategory = (
  category: string
): FileUploadCategory => {
  const categories: Record<string, FileUploadCategory> = {
    budgetPrevisionnelDemande: FileUploadCategory.BUDGET_PREVISIONNEL_DEMANDE,
    rapportBudgetaire: FileUploadCategory.RAPPORT_BUDGETAIRE,
    budgetPrevisionnelRetenu: FileUploadCategory.BUDGET_PREVISIONNEL_RETENU,
    budgetRectificatif: FileUploadCategory.BUDGET_RECTIFICATIF,
    compteAdministratifSoumis: FileUploadCategory.COMPTE_ADMINISTRATIF_SOUMIS,
    rapportActivite: FileUploadCategory.RAPPORT_ACTIVITE,
    compteAdministratifRetenu: FileUploadCategory.COMPTE_ADMINISTRATIF_RETENU,
    demandeSubvention: FileUploadCategory.DEMANDE_SUBVENTION,
    compteRenduFinancier: FileUploadCategory.COMPTE_RENDU_FINANCIER,
    rapportActiviteOperateur: FileUploadCategory.RAPPORT_ACTIVITE_OPERATEUR,
    arreteAutorisation: FileUploadCategory.ARRETE_AUTORISATION,
    convention: FileUploadCategory.CONVENTION,
    arreteTarification: FileUploadCategory.ARRETE_TARIFICATION,
    cpom: FileUploadCategory.CPOM,
    inspectionControle: FileUploadCategory.INSPECTION_CONTROLE,
    autre: FileUploadCategory.AUTRE,
  };
  return categories[category];
};

export const convertFromCategoryToCategoryName = (
  category: FileUploadCategory
): string => {
  const categories: Record<FileUploadCategory, string> = {
    [FileUploadCategory.BUDGET_PREVISIONNEL_DEMANDE]:
      "budgetPrevisionnelDemande",
    [FileUploadCategory.RAPPORT_BUDGETAIRE]: "rapportBudgetaire",
    [FileUploadCategory.BUDGET_PREVISIONNEL_RETENU]: "budgetPrevisionnelRetenu",
    [FileUploadCategory.BUDGET_RECTIFICATIF]: "budgetRectificatif",
    [FileUploadCategory.COMPTE_ADMINISTRATIF_SOUMIS]:
      "compteAdministratifSoumis",
    [FileUploadCategory.RAPPORT_ACTIVITE]: "rapportActivite",
    [FileUploadCategory.COMPTE_ADMINISTRATIF_RETENU]:
      "compteAdministratifRetenu",
    [FileUploadCategory.DEMANDE_SUBVENTION]: "demandeSubvention",
    [FileUploadCategory.COMPTE_RENDU_FINANCIER]: "compteRenduFinancier",
    [FileUploadCategory.RAPPORT_ACTIVITE_OPERATEUR]: "rapportActiviteOperateur",
    [FileUploadCategory.ARRETE_AUTORISATION]: "arreteAutorisation",
    [FileUploadCategory.CONVENTION]: "convention",
    [FileUploadCategory.ARRETE_TARIFICATION]: "arreteTarification",
    [FileUploadCategory.CPOM]: "cpom",
    [FileUploadCategory.INSPECTION_CONTROLE]: "inspectionControle",
    [FileUploadCategory.AUTRE]: "autre",
  };
  return categories[category];
};

export const handleAdresses = (
  dnaCode: string,
  adresses: CreateAdresse[]
): Omit<AdresseWithTypologies, "id">[] => {
  return adresses.map((adresse) => {
    return {
      adresse: adresse.adresse,
      codePostal: adresse.codePostal,
      commune: adresse.commune,
      repartition: convertToRepartition(adresse.repartition),
      structureDnaCode: dnaCode,
      adresseTypologies: adresse.typologies,
    };
  });
};

export type AdresseWithTypologies = Adresse & {
  adresseTypologies: CreateAdresseTypologie[];
};

export const frDateField = () =>
  z.preprocess(parseFrDate, z.coerce.date().optional());

export const mandatoryFrDateField = () =>
  z.preprocess(parseFrDate, z.coerce.date());
