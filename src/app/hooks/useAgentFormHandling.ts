import { useRouter } from "next/navigation";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { useStructureContext } from "../(authenticated)/structures/[id]/context/StructureClientContext";
import { finalisationQualiteSchemaSimple } from "../(authenticated)/structures/[id]/finalisation/05-qualite/validation/FinalisationQualiteSchema";
import { FormAdresse } from "../utils/adresse.util";
import { CategoryDisplayRulesType } from "../utils/categoryToDisplay.util";
import { useStructures } from "./useStructures";

export type FormSubmitData = {
  dnaCode?: string;
  [key: string]: unknown;
};

export const useAgentFormHandling = ({
  nextRoute,
  categoriesDisplayRules,
}: {
  nextRoute?: string;
  categoriesDisplayRules?: CategoryDisplayRulesType;
}) => {
  const router = useRouter();

  const { structure, setStructure } = useStructureContext();

  const { updateAndRefreshStructure, handleAdresses } = useStructures();

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [backendError, setBackendError] = useState<string | undefined>(
    undefined
  );

  const handleSubmit = async (data: FormSubmitData) => {
    setState("loading");
    try {
      const adresses = handleAdresses(data.adresses as Partial<FormAdresse>[]);
      const updatedStructure = await updateAndRefreshStructure(
        structure.id,
        { ...data, adresses },
        setStructure
      );
      if (updatedStructure === "OK") {
        if (nextRoute) {
          router.push(nextRoute);
        }
      } else {
        console.error(updatedStructure);
        setState("error");
        setBackendError(updatedStructure?.toString());
        throw new Error(updatedStructure?.toString());
      }
    } catch (error) {
      setState("error");
      setBackendError(error instanceof Error ? error.message : String(error));
      throw error;
    }
  };

  const handleQualiteFormSubmit = async (
    data: z.infer<typeof finalisationQualiteSchemaSimple>,
    methods: UseFormReturn<z.infer<typeof finalisationQualiteSchemaSimple>>
  ) => {
    if (!categoriesDisplayRules) {
      return;
    }
    const setError = methods.setError;
    const fileUploads = data.fileUploads;
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
    } else {
      const filteredFileUploads = fileUploads?.filter((fileUpload) => {
        return fileUpload.key !== undefined;
      });

      await handleSubmit({
        fileUploads: filteredFileUploads,
        dnaCode: structure.dnaCode,
      });
    }
  };

  return {
    handleSubmit,
    handleQualiteFormSubmit,
    state,
    backendError,
  };
};
