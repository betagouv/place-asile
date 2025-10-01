"use client";
import Notice from "@codegouvfr/react-dsfr/Notice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useStructures } from "@/app/hooks/useStructures";
import { isStructureSubventionnee } from "@/app/utils/structure.util";
import {
  DdetsFileUploadCategory,
  DdetsFileUploadCategoryType,
  zDdetsFileUploadCategory,
} from "@/types/file-upload.type";
import { StructureState } from "@/types/structure.type";

import { useStructureContext } from "../../context/StructureClientContext";
import { getCurrentStepData } from "../components/Steps";
import UploadsByCategory from "./components/UploadsByCategory";
import {
  fileUploadSchema,
  finalisationQualiteSchemaSimple,
} from "./validation/FinalisationQualiteSchema";

export enum FileMetaData {
  DATE_TYPE,
  DATE_START_END,
  NAME,
}

export const FinalisationQualiteForm = ({
  currentStep,
}: {
  currentStep: number;
}) => {
  const { structure, setStructure } = useStructureContext();
  const { nextRoute, previousRoute } = getCurrentStepData(
    currentStep,
    structure.id
  );

  const { updateAndRefreshStructure } = useStructures();
  const router = useRouter();

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [backendError, setBackendError] = useState<string | undefined>("");

  const categoriesToDisplay = DdetsFileUploadCategory.filter((category) => {
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

  const categoriesDisplayRules: CategoryDisplayRulesType = {
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
      notice: (
        <>
          Dans cette catégorie, vous avez la possibilité d’importer d’autres
          documents utiles à l’analyse de la structure (ex:{" "}
          <i>Plans Pluriannuels d’Inverstissements</i>)
        </>
      ),
    },
  };

  const handleSubmit = async (
    data: z.infer<typeof finalisationQualiteSchemaSimple>,
    methods: UseFormReturn<z.infer<typeof finalisationQualiteSchemaSimple>>
  ) => {
    setState("loading");
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

      return;
    } else {
      const filteredFileUploads = fileUploads?.filter((fileUpload) => {
        return fileUpload.key !== undefined;
      }) as z.infer<typeof fileUploadSchema>[];

      const updatedStructure = await updateAndRefreshStructure(
        structure.id,
        {
          fileUploads: filteredFileUploads,
          dnaCode: structure.dnaCode,
        },
        setStructure
      );
      if (updatedStructure === "OK") {
        router.push(nextRoute);
      } else {
        setState("error");
        setBackendError(updatedStructure?.toString());
        throw new Error(updatedStructure?.toString());
      }
    }
  };

  const filteredFileUploads = structure.fileUploads?.filter(
    (fileUpload) =>
      fileUpload?.category &&
      categoriesToDisplay.includes(
        fileUpload.category as DdetsFileUploadCategoryType[number]
      )
  );

  const defaultValuesFromDb = (filteredFileUploads || [])?.map((fileUpload) => {
    const formattedFileUploads = {
      ...fileUpload,
      uuid: uuidv4(),
      key: fileUpload.key,
      category: String(fileUpload.category) as z.infer<
        typeof zDdetsFileUploadCategory
      >,
      date:
        fileUpload.date && fileUpload.date instanceof Date
          ? fileUpload.date.toISOString()
          : fileUpload.date || undefined,
      startDate:
        fileUpload.startDate && fileUpload.startDate instanceof Date
          ? fileUpload.startDate.toISOString()
          : fileUpload.startDate || undefined,
      endDate:
        fileUpload.endDate && fileUpload.endDate instanceof Date
          ? fileUpload.endDate.toISOString()
          : fileUpload.endDate || undefined,
      categoryName: fileUpload.categoryName || "Document",
      parentFileUploadId: Number(fileUpload.parentFileUploadId) || undefined,
    };
    return formattedFileUploads;
  });

  const createEmptyDefaultValues = () => {
    const filesToAdd: {
      uuid: string;
      category: z.infer<typeof zDdetsFileUploadCategory>;
    }[] = [];

    const missingCategories = categoriesToDisplay.filter(
      (category) =>
        !filteredFileUploads?.some(
          (fileUpload) => fileUpload.category === category
        )
    );

    missingCategories.forEach((category) => {
      filesToAdd.push({
        uuid: uuidv4(),
        category: category,
      });
    });

    return filesToAdd;
  };

  const defaultValues = {
    fileUploads: [...defaultValuesFromDb, ...createEmptyDefaultValues()],
  };

  return (
    <FormWrapper
      schema={finalisationQualiteSchemaSimple}
      onSubmit={handleSubmit}
      submitButtonText="Étape suivante"
      previousStep={previousRoute}
      availableFooterButtons={[FooterButtonType.SUBMIT]}
      defaultValues={defaultValues}
    >
      {structure.state === StructureState.A_FINALISER && (
        <InformationBar
          variant="info"
          title="À compléter"
          description="Veuillez remplir les champs obligatoires ci-dessous. Si une donnée vous est inconnue, contactez-nous."
        />
      )}
      <p className="w-4/5">
        Veuillez importer l’ensemble des actes administratifs historiques
        afférents à la structure, que les dates d’effets soient actuelles ou
        révolues. Veuillez également renseigner les informations concernant
        l’ensemble des inspections-contrôles auxquelles la structure a été
        soumise.
      </p>
      <Notice
        severity="info"
        title=""
        className="rounded [&_p]:flex [&_p]:items-center mb-8 w-fit [&_.fr-notice\_\_desc]:text-text-default-grey"
        description={
          <>
            Taille maximale par fichier : 10 Mo. Formats supportés : pdf, xls,
            xlsx, csv et ods.
            <br />
            <a
              target="_blank"
              className="underline"
              rel="noopener noreferrer"
              href="https://stirling-pdf.framalab.org/compress-pdf?lang=fr_FR"
            >
              Votre fichier est trop lourd ? Compressez-le
            </a>
          </>
        }
      />

      {categoriesToDisplay.map((category, index) => {
        return (
          <>
            <UploadsByCategory
              key={category}
              category={category}
              categoryShortName={
                categoriesDisplayRules[category].categoryShortName
              }
              title={categoriesDisplayRules[category].title}
              canAddFile={categoriesDisplayRules[category].canAddFile}
              canAddAvenant={categoriesDisplayRules[category].canAddAvenant}
              isOptional={categoriesDisplayRules[category].isOptional}
              fileMetaData={categoriesDisplayRules[category].fileMetaData}
              documentLabel={categoriesDisplayRules[category].documentLabel}
              addFileButtonLabel={
                categoriesDisplayRules[category].addFileButtonLabel
              }
              notice={categoriesDisplayRules[category].notice}
            />
            {index < categoriesToDisplay.length - 1 && <hr />}
          </>
        );
      })}
      {state === "error" && (
        <SubmitError
          structureDnaCode={structure.dnaCode}
          backendError={backendError}
        />
      )}
    </FormWrapper>
  );
};

type CategoryDisplayRulesType = Record<
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
