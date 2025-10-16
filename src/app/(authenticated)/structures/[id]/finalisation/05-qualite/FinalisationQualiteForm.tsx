"use client";
import Notice from "@codegouvfr/react-dsfr/Notice";

import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import WarningRequiredFields from "@/app/components/forms/WarningRequiredFields";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import {
  getCategoriesDisplayRules,
  getCategoriesToDisplay,
} from "@/app/utils/categoryToDisplay.util";
import { getQualiteFormDefaultValues } from "@/app/utils/defaultValues.util";
import { finalisationQualiteSchema } from "@/schemas/finalisation/finalisationQualite.schema";
import { StructureState } from "@/types/structure.type";

import { useStructureContext } from "../../context/StructureClientContext";
import { getCurrentStepData } from "../components/Steps";
import UploadsByCategory from "./components/UploadsByCategory";

export enum FileMetaData {
  INSPECTION_CONTROLE,
  DATE_START_END,
  NAME,
}

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

  const categoriesToDisplay = getCategoriesToDisplay(structure);

  const categoriesDisplayRules = getCategoriesDisplayRules(structure);

  const { handleQualiteFormSubmit, state, backendError } = useAgentFormHandling(
    {
      nextRoute,
      categoriesDisplayRules,
    }
  );

  const defaultValues = getQualiteFormDefaultValues({
    structure,
    categoriesToDisplay,
  });

  return (
    <FormWrapper
      schema={finalisationQualiteSchema}
      onSubmit={handleQualiteFormSubmit}
      submitButtonText="Étape suivante"
      previousStep={previousRoute}
      availableFooterButtons={[FooterButtonType.SUBMIT]}
      defaultValues={defaultValues}
    >
      <WarningRequiredFields structure={structure} />

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
          <div key={category}>
            <UploadsByCategory
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
            {index < categoriesToDisplay.length - 1 && <hr className="mt-13" />}
          </div>
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
