import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import React, { useState } from "react";
import { getCurrentStepData } from "../components/Steps";
import { useStructureContext } from "../../context/StructureClientContext";
import { finalisationQualiteSchema } from "./validation/FinalisationQualiteSchema";
import { InformationBar } from "@/app/components/ui/InformationBar";
import Notice from "@codegouvfr/react-dsfr/Notice";
import { UploadsByCategory } from "./components/UploadsByCategory";
import { FileMetaData } from "./components/FilesContext";
import { useStructures } from "@/app/hooks/useStructures";
import { useRouter } from "next/navigation";
import { SubmitError } from "@/app/components/SubmitError";
import { FileUploadCategory } from "@/types/file-upload.type";
import { isStructureAutorisee } from "@/app/utils/structure.util";

export const FinalisationQualiteForm = ({
  currentStep,
}: {
  currentStep: number;
}) => {
  const { structure } = useStructureContext();
  const { nextRoute, previousRoute } = getCurrentStepData(
    currentStep,
    structure.id
  );

  const { updateStructure } = useStructures();
  const router = useRouter();

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [backendError, setBackendError] = useState<string | undefined>("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    setState("loading");
    // TODO : refacto pour faire coller RHF, Zod et les file uploads, sans avoir à passer par des objets intermédiaires
    const fileUploads = [
      ...(data[FileUploadCategory.INSPECTION_CONTROLE] ?? []),
      ...(data[FileUploadCategory.ARRETE_AUTORISATION] ?? []),
      ...(data[FileUploadCategory.ARRETE_AUTORISATION_AVENANT] ?? []),
      ...(data[FileUploadCategory.CONVENTION] ?? []),
      ...(data[FileUploadCategory.CONVENTION_AVENANT] ?? []),
      ...(data[FileUploadCategory.ARRETE_TARIFICATION] ?? []),
      ...(data[FileUploadCategory.ARRETE_TARIFICATION_AVENANT] ?? []),
      ...(data[FileUploadCategory.CPOM] ?? []),
      ...(data[FileUploadCategory.CPOM_AVENANT] ?? []),
      ...(data[FileUploadCategory.AUTRE] ?? []),
    ].filter((fileUpload) => fileUpload.key);

    const controles = (data[FileUploadCategory.INSPECTION_CONTROLE] ?? [])
      .map((controle: { date: Date; type: string; key: string }) => {
        return {
          date: controle.date,
          type: controle.type,
          fileUploadKey: controle.key,
        };
      })
      .filter(
        (controle: { date: Date; type: string; key: string }) => controle.type
      );

    const updatedStructure = await updateStructure({
      fileUploads,
      controles,
      dnaCode: structure.dnaCode,
    });
    if (updatedStructure === "OK") {
      router.push(nextRoute);
    } else {
      setState("error");
      setBackendError(updatedStructure?.toString());
      throw new Error(updatedStructure?.toString());
    }
  };

  return (
    <FormWrapper
      schema={finalisationQualiteSchema}
      onSubmit={handleSubmit}
      submitButtonText="Étape suivante"
      previousStep={previousRoute}
      availableFooterButtons={[FooterButtonType.SUBMIT]}
    >
      <InformationBar
        variant="info"
        title="À compléter"
        description="Veuillez remplir les champs obligatoires ci-dessous. Si une donnée vous est inconnue, contactez-nous."
      />
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
        className="rounded [&_p]:flex  [&_p]:items-center mb-8 w-fit [&_.fr-notice\_\_desc]:text-text-default-grey"
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
        categoryId={FileUploadCategory.INSPECTION_CONTROLE}
        categoryShortName="controles"
        documentLabel="Rapport"
        fieldBaseName="controles"
        title="Inspections-contrôles"
        addFileButtonLabel="Ajouter une inspection-contrôle"
        fileMetaData={FileMetaData.DATE_TYPE}
        canAddFile
        isOptional
        files={[
          {
            date: "2025-01-01",
            type: "programme",
            key: "controle-1",
          },
        ]}
      />
      {isStructureAutorisee(structure.type) && (
        <UploadsByCategory
          categoryId={FileUploadCategory.ARRETE_AUTORISATION}
          categoryShortName="arrêté"
          fieldBaseName="fileUploads"
          title="Arrêtés d’autorisation"
          canAddFile
          addFileButtonLabel="Ajouter un arrêté d'autorisation"
          canAddAvenant
          fileMetaData={FileMetaData.DATE_START_END}
          // TODO : initialiser autrement le tableau de files
          files={[
            {
              startDate: "2025-01-01",
              endDate: "2026-01-01",
              key: "arrete-autorisation-1",
            },
          ]}
        />
      )}

      <UploadsByCategory
        categoryId={FileUploadCategory.CONVENTION}
        categoryShortName="convention"
        fieldBaseName="fileUploads"
        title="Conventions"
        isOptional={isStructureAutorisee(structure.type)}
        canAddFile
        addFileButtonLabel="Ajouter une convention"
        canAddAvenant
        fileMetaData={FileMetaData.DATE_START_END}
        files={[
          {
            startDate: "2025-01-01",
            endDate: "2026-01-01",
            key: "convention-1",
          },
        ]}
      />

      {isStructureAutorisee(structure.type) && (
        <UploadsByCategory
          categoryId={FileUploadCategory.ARRETE_TARIFICATION}
          categoryShortName="arrêté"
          fieldBaseName="fileUploads"
          title="Arrêtés de tarification"
          canAddFile
          addFileButtonLabel="Ajouter un arrêté de tarification"
          canAddAvenant
          fileMetaData={FileMetaData.DATE_START_END}
          files={[
            {
              startDate: "2025-01-01",
              endDate: "2026-01-01",
              key: "arrete-tarification-1",
            },
          ]}
        />
      )}

      {structure.cpom && (
        <UploadsByCategory
          categoryId={FileUploadCategory.CPOM}
          categoryShortName="CPOM"
          fieldBaseName="fileUploads"
          title="CPOM"
          canAddFile
          addFileButtonLabel="Ajouter un CPOM"
          canAddAvenant
          fileMetaData={FileMetaData.DATE_START_END}
          files={[
            {
              startDate: "2025-01-01",
              endDate: "2026-01-01",
              key: "cpom-1",
            },
          ]}
        />
      )}

      <UploadsByCategory
        categoryId={FileUploadCategory.AUTRE}
        categoryShortName="Autres"
        fieldBaseName="fileUploads"
        title="Autres documents"
        isOptional
        canAddFile
        addFileButtonLabel="Ajouter un document"
        fileMetaData={FileMetaData.NAME}
        files={[
          {
            startDate: "2025-01-01",
            endDate: "2026-01-01",
            key: "autre-1",
          },
        ]}
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
