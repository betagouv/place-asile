import { UseFormReturn } from "react-hook-form";

import { FileUploadFormValues } from "@/schemas/forms/base/documents.schema";
import { FileUploadsFormValues } from "@/schemas/forms/base/documents.schema";
import { CategoryDisplayRulesType } from "@/types/categoryToDisplay.type";

export const filterFileUploads = async (
  fileUploads: FileUploadFormValues[] | undefined,
  methods: UseFormReturn<FileUploadsFormValues>,
  categoriesDisplayRules: CategoryDisplayRulesType
) => {
  if (!categoriesDisplayRules || !fileUploads) {
    return;
  }

  const setError = methods.setError;

  const requiredCategories = Object.keys(categoriesDisplayRules).filter(
    (category) =>
      !categoriesDisplayRules[category as keyof typeof categoriesDisplayRules]
        .isOptional
  );

  let firstErrorIndex: number | null = null;

  const missingRequiredUploads = fileUploads?.flatMap((fileUpload, index) => {
    if (requiredCategories.includes(fileUpload.category) && !fileUpload.key) {
      return { fileUpload, index };
    }
    return [];
  });

  if (missingRequiredUploads?.length) {
    firstErrorIndex = missingRequiredUploads[0].index;

    missingRequiredUploads.forEach(({ index }) => {
      setError(`fileUploads.${index}.key` as const, {
        type: "custom",
        message: "Veuillez sélectionner au moins un document.",
      });
    });
  }

  if (firstErrorIndex !== null) {
    setTimeout(() => {
      const errorField = document.querySelector(
        `[name="fileUploads.${firstErrorIndex}.key"]`
      );
      if (errorField instanceof HTMLElement) {
        errorField.focus();
        errorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);

    return undefined;
  }

  return fileUploads;
};
