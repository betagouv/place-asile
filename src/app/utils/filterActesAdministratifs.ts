import { UseFormReturn } from "react-hook-form";

import {
  ActeAdministratifFormValues,
  ActesAdministratifsFormValues,
} from "@/schemas/forms/base/acteAdministratif";
import { CategoryDisplayRulesType } from "@/types/categoryToDisplay.type";

export const filterActesAdministratifs = async (
  actesAdministratifs: ActeAdministratifFormValues[] | undefined,
  methods: UseFormReturn<ActesAdministratifsFormValues>,
  categoriesDisplayRules: CategoryDisplayRulesType
) => {
  if (!categoriesDisplayRules || !actesAdministratifs) {
    return;
  }

  const setError = methods.setError;

  const requiredCategories = Object.keys(categoriesDisplayRules).filter(
    (category) =>
      !categoriesDisplayRules[category as keyof typeof categoriesDisplayRules]
        .isOptional
  );

  let firstErrorIndex: number | null = null;

  const missingRequiredUploads = actesAdministratifs?.flatMap(
    (fileUpload, index) => {
      if (requiredCategories.includes(fileUpload.category) && !fileUpload.key) {
        return { fileUpload, index };
      }
      return [];
    }
  );

  if (missingRequiredUploads?.length) {
    firstErrorIndex = missingRequiredUploads[0].index;

    missingRequiredUploads.forEach(({ index }) => {
      setError(`actesAdministratifs.${index}.key` as const, {
        type: "custom",
        message: "Veuillez sélectionner au moins un document.",
      });
    });
  }

  if (firstErrorIndex !== null) {
    setTimeout(() => {
      const errorField = document.querySelector(
        `[name="actesAdministratifs.${firstErrorIndex}.key"]`
      );
      if (errorField instanceof HTMLElement) {
        errorField.focus();
        errorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);

    return undefined;
  }

  return actesAdministratifs;
};
