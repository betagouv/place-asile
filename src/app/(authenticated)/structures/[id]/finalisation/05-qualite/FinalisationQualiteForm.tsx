"use client";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { MaxSizeNotice } from "@/app/components/forms/MaxSizeNotice";
import { Disclaimer } from "@/app/components/forms/qualite/Disclaimer";
import UploadsByCategory from "@/app/components/forms/qualite/UploadsByCategory";
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
      {structure.state === StructureState.A_FINALISER && (
        <InformationBar
          variant="info"
          title="À compléter"
          description="Veuillez remplir les champs obligatoires ci-dessous. Si une donnée vous est inconnue, contactez-nous."
        />
      )}
      <Disclaimer />

      <MaxSizeNotice />

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
