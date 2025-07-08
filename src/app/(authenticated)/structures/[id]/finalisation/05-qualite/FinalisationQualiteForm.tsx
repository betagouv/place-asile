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
    console.log(">>>>>>>>>>>", data);
    const updatedStructure = await updateStructure({
      ...data,
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
      <p className="w-3/5">
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
        categoryId="Controles"
        categoryShortName="controles"
        documentLabel="Rapport"
        fieldBaseName="controles"
        title="Inspections-contrôles"
        addFileButtonLabel="Ajouter une inspection-contrôle"
        fileMetaData={FileMetaData.DATE_TYPE}
        canAddFile
        canAddAvenant
        isOptional
        files={[
          {
            date: "2025-01-01",
            type: "programme",
            key: "",
            avenants: [
              {
                date: "2025-01-01",
                type: "programme",
                key: "",
              },
              {
                date: "2024-01-01",
                type: "programme",
                key: "",
              },
            ],
          },
          {
            date: "2024-01-01",
            type: "programme",
            key: "",
          },
        ]}
      />

      <UploadsByCategory
        categoryId="ArretesAutorisation"
        categoryShortName="arrêté"
        fieldBaseName="fileUploads"
        title="Arrêtés d’autorisation"
        canAddFile
        addFileButtonLabel="Ajouter un arrêté d'autorisation"
        canAddAvenant
        fileMetaData={FileMetaData.DATE_START_END}
      />

      <UploadsByCategory
        categoryId="Conventions"
        categoryShortName="convention"
        fieldBaseName="fileUploads"
        title="Conventions"
        isOptional
        canAddFile
        addFileButtonLabel="Ajouter une convention"
        canAddAvenant
        fileMetaData={FileMetaData.DATE_START_END}
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
