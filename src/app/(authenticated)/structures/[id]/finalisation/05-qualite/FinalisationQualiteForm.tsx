"use client";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import React, { useState } from "react";
import { getCurrentStepData } from "../components/Steps";
import { useStructureContext } from "../../context/StructureClientContext";
import { finalisationQualiteSchemaSimple } from "./validation/FinalisationQualiteSchema";
import { InformationBar } from "@/app/components/ui/InformationBar";
import Notice from "@codegouvfr/react-dsfr/Notice";
import { useStructures } from "@/app/hooks/useStructures";
import { useRouter } from "next/navigation";
import { SubmitError } from "@/app/components/SubmitError";
import { FileUpload, FileUploadCategory } from "@/types/file-upload.type";
import { StructureState } from "@/types/structure.type";
import { v4 as uuidv4 } from "uuid";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import { z } from "zod";
import UploadsByCategory from "./components/UploadsByCategory";

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

  console.log("structure", structure);

  const { updateAndRefreshStructure } = useStructures();
  const router = useRouter();

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [backendError, setBackendError] = useState<string | undefined>("");

  const handleSubmit = async (
    data: z.infer<typeof finalisationQualiteSchemaSimple>
  ) => {
    setState("loading");

    console.log("data", data);

    const fileUploads = data.fileUploads as FileUpload[];

    console.log("fileUploads", fileUploads);

    return;

    // const controles = (data[FileUploadCategory.INSPECTION_CONTROLE] ?? [])
    //   .map((controle: { date: Date; type: string; key: string }) => {
    //     return {
    //       date: controle.date,
    //       type: controle.type,
    //       fileUploadKey: controle.key,
    //     };
    //   })
    //   .filter(
    //     (controle: { date: Date; type: string; key: string }) => controle.type
    //   );

    const updatedStructure = await updateAndRefreshStructure(
      structure.id,
      {
        // controles,
        fileUploads: fileUploads,
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
  };

  // console.log("structure", structure);

  // Default values for the form
  const formDefaultValues = {
    fileUploads: (structure?.fileUploads as FileUpload[])
      ? structure?.fileUploads
          ?.filter((fileUpload) => fileUpload.category !== null) // Filter out null categories
          ?.map((fileUpload) => {
            return {
              ...fileUpload,
              uuid: uuidv4(),
              key: fileUpload.key,
              category: fileUpload.category, // Now guaranteed to be non-null
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
              // Ensure categoryName is always provided
              categoryName: fileUpload.categoryName || "Document",
              // Ensure parentFileUploadId is a string or undefined
              parentFileUploadId:
                Number(fileUpload.parentFileUploadId) || undefined,
            };
          })
      : [],
  };

  console.log("formDefaultValues", formDefaultValues);

  return (
    <FormWrapper
      schema={finalisationQualiteSchemaSimple}
      onSubmit={handleSubmit}
      submitButtonText="Étape suivante"
      previousStep={previousRoute}
      availableFooterButtons={[FooterButtonType.SUBMIT]}
      defaultValues={formDefaultValues}
    >
      {structure.state === StructureState.A_FINALISER && (
        <InformationBar
          variant="info"
          title="À compléter"
          description="Veuillez remplir les champs obligatoires ci-dessous. Si une donnée vous est inconnue, contactez-nous."
        />
      )}
      <p className="w-4/5">
        Veuillez renseigner les informations concernant l’ensemble des
        inspections-contrôles auxquelles la structure a été soumise. Veuillez
        également importer l’ensemble des actes administratifs historiques
        afférents à la structure, que les dates d’effets soient actuelles ou
        révolues.
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

      <UploadsByCategory
        category={FileUploadCategory.INSPECTION_CONTROLE}
        title="Inspections-contrôles"
        canAddFile
        canAddAvenant
        isOptional
        fileMetaData={FileMetaData.DATE_TYPE}
        documentLabel="Rapport"
        addFileButtonLabel="Ajouter une inspection-contrôle"
      />
      {isStructureAutorisee(structure.type) && (
        <UploadsByCategory
          category={FileUploadCategory.ARRETE_AUTORISATION}
          title="Arrêtés d’autorisation"
          canAddFile
          isOptional
          fileMetaData={FileMetaData.DATE_START_END}
          documentLabel="Rapport"
          addFileButtonLabel="Ajouter un arrêté d'autorisation"
        />
      )}

      <UploadsByCategory
        category={FileUploadCategory.CONVENTION}
        title="Conventions"
        canAddFile
        isOptional={isStructureAutorisee(structure.type)}
        fileMetaData={FileMetaData.DATE_START_END}
        documentLabel="Rapport"
        addFileButtonLabel="Ajouter une convention"
      />

      {isStructureAutorisee(structure.type) && (
        <UploadsByCategory
          category={FileUploadCategory.ARRETE_TARIFICATION}
          title="Arrêtés de tarification"
          canAddFile
          isOptional
          fileMetaData={FileMetaData.DATE_START_END}
          documentLabel="Rapport"
          addFileButtonLabel="Ajouter un arrêté de tarification"
        />
      )}
      {structure.cpom && (
        <UploadsByCategory
          category={FileUploadCategory.CPOM}
          title="CPOM"
          canAddFile
          canAddAvenant
          fileMetaData={FileMetaData.DATE_START_END}
          documentLabel="Rapport"
          addFileButtonLabel="Ajouter un CPOM"
        />
      )}
      <UploadsByCategory
        category={FileUploadCategory.AUTRE}
        title="Autres documents"
        canAddFile
        isOptional
        fileMetaData={FileMetaData.NAME}
        documentLabel="Document"
        addFileButtonLabel="Ajouter un document"
      />

      {state === "error" && (
        <SubmitError
          structureDnaCode={structure.dnaCode}
          backendError={backendError}
        />
      )}
    </FormWrapper>
  );
};
