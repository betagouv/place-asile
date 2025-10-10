import {
  DdetsFileUploadCategory,
  DdetsFileUploadCategoryType,
} from "@/types/file-upload.type";
import { StructureWithLatLng } from "@/types/structure.type";

import { FileMetaData } from "../(authenticated)/structures/[id]/finalisation/05-qualite/FinalisationQualiteForm";
import { isStructureSubventionnee } from "./structure.util";

export const getCategoriesToDisplay = (
  structure: StructureWithLatLng
): DdetsFileUploadCategoryType[number][] =>
  DdetsFileUploadCategory.filter((category) => {
    if (category === "CPOM" && !structure.cpom) {
      return false;
    }

    if (isStructureSubventionnee(structure.type)) {
      return (
        category !== "ARRETE_AUTORISATION" && category !== "ARRETE_TARIFICATION"
      );
    }
    return true;
  });

export const getCategoriesDisplayRules = (
  structure: StructureWithLatLng
): CategoryDisplayRulesType => ({
  ARRETE_AUTORISATION: {
    categoryShortName: "arrêté",
    title: "Arrêtés d'autorisation",
    canAddFile: true,
    canAddAvenant: true,
    isOptional: false,
    fileMetaData: FileMetaData.DATE_START_END,
    documentLabel: "Document",
    addFileButtonLabel: "Ajouter un arrêté d'autorisation",
  },
  ARRETE_TARIFICATION: {
    categoryShortName: "arrêté",
    title: "Arrêtés de tarification",
    canAddFile: true,
    canAddAvenant: true,
    isOptional: false,
    fileMetaData: FileMetaData.DATE_START_END,
    documentLabel: "Document",
    addFileButtonLabel: "Ajouter un arrêté de tarification",
  },
  CPOM: {
    categoryShortName: "cpom",
    title: "CPOM",
    canAddFile: true,
    isOptional: false,
    canAddAvenant: true,
    fileMetaData: FileMetaData.DATE_START_END,
    documentLabel: "Document",
    addFileButtonLabel: "Ajouter un CPOM",
  },
  CONVENTION: {
    categoryShortName: "convention",
    title: "Conventions",
    canAddFile: true,
    canAddAvenant: true,
    isOptional: !isStructureSubventionnee(structure.type),
    fileMetaData: FileMetaData.DATE_START_END,
    documentLabel: "Document",
    addFileButtonLabel: "Ajouter une convention",
  },
  INSPECTION_CONTROLE: {
    categoryShortName: "",
    title: "Inspections-contrôles",
    canAddFile: true,
    isOptional: true,
    canAddAvenant: false,
    fileMetaData: FileMetaData.DATE_TYPE,
    documentLabel: "Rapport",
    addFileButtonLabel: "Ajouter une inspection-contrôle",
  },
  AUTRE: {
    categoryShortName: "autre",
    title: "Autres documents",
    canAddFile: true,
    canAddAvenant: false,
    isOptional: true,
    fileMetaData: FileMetaData.NAME,
    documentLabel: "Document",
    addFileButtonLabel: "Ajouter un document",
    notice: `Dans cette catégorie, vous avez la possibilité d’importer d’autres
        documents utiles à l’analyse de la structure (ex: 
        Plans Pluriannuels d’Investissements)`,
  },
});

export type CategoryDisplayRulesType = Record<
  (typeof DdetsFileUploadCategory)[number],
  {
    categoryShortName: string;
    title: string;
    canAddFile: boolean;
    canAddAvenant: boolean;
    isOptional: boolean;
    fileMetaData: FileMetaData;
    documentLabel: string;
    addFileButtonLabel: string;
    notice?: string | React.ReactElement;
  }
>;
