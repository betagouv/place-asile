import { StructureApiType } from "@/schemas/api/structure.schema";
import {
  AdditionalFieldsType,
  CategoryDisplayRulesType,
} from "@/types/categoryToDisplay.type";
import {
  ActeAdministratifCategory,
  ActeAdministratifCategoryType,
} from "@/types/file-upload.type";

import { isStructureSubventionnee } from "./structure.util";

export const getCategoriesToDisplay = (
  structure: StructureApiType
): ActeAdministratifCategoryType[number][] =>
  ActeAdministratifCategory.filter((category) => {
    if (category === "EVALUATION" || category === "INSPECTION_CONTROLE") {
      return false;
    }

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
  structure: StructureApiType
): CategoryDisplayRulesType => ({
  ARRETE_AUTORISATION: {
    categoryShortName: "arrêté",
    title: "Arrêtés d'autorisation",
    canAddFile: true,
    canAddAvenant: true,
    isOptional: false,
    additionalFieldsType: AdditionalFieldsType.DATE_START_END,
    documentLabel: "Document",
    addFileButtonLabel: "Ajouter un arrêté d'autorisation",
  },
  ARRETE_TARIFICATION: {
    categoryShortName: "arrêté",
    title: "Arrêtés de tarification",
    canAddFile: true,
    canAddAvenant: true,
    isOptional: false,
    additionalFieldsType: AdditionalFieldsType.DATE_START_END,
    documentLabel: "Document",
    addFileButtonLabel: "Ajouter un arrêté de tarification",
  },
  CPOM: {
    categoryShortName: "CPOM",
    title: "CPOM",
    canAddFile: true,
    isOptional: false,
    canAddAvenant: true,
    additionalFieldsType: AdditionalFieldsType.DATE_START_END,
    documentLabel: "Document",
    addFileButtonLabel: "Ajouter un CPOM",
  },
  CONVENTION: {
    categoryShortName: "convention",
    title: "Conventions",
    canAddFile: true,
    canAddAvenant: true,
    isOptional: !isStructureSubventionnee(structure.type),
    additionalFieldsType: AdditionalFieldsType.DATE_START_END,
    documentLabel: "Document",
    addFileButtonLabel: "Ajouter une convention",
  },
  INSPECTION_CONTROLE: {
    categoryShortName: "",
    title: "Inspections-contrôles",
    canAddFile: true,
    isOptional: true,
    canAddAvenant: false,
    additionalFieldsType: AdditionalFieldsType.INSPECTION_CONTROLE,
    documentLabel: "Rapport",
    addFileButtonLabel: "Ajouter une inspection-contrôle",
  },
  EVALUATION: {
    categoryShortName: "",
    title: "Evaluations",
    canAddFile: true,
    isOptional: true,
    canAddAvenant: false,
    additionalFieldsType: AdditionalFieldsType.EVALUATION,
    documentLabel: "Rapport",
    addFileButtonLabel: "Ajouter une évaluation",
  },
  AUTRE: {
    categoryShortName: "autre",
    title: "Autres documents",
    canAddFile: true,
    canAddAvenant: false,
    isOptional: true,
    additionalFieldsType: AdditionalFieldsType.NAME,
    documentLabel: "Document",
    addFileButtonLabel: "Ajouter un document",
    notice: `Dans cette catégorie, vous avez la possibilité d’importer d’autres
        documents utiles à l’analyse de la structure (ex: 
        Plans Pluriannuels d’Investissements)`,
  },
});
