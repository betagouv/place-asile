"use client";
import { UseFormReturn } from "react-hook-form";

import { Disclaimer } from "@/app/components/forms/documents/Disclaimer";
import UploadsByCategory from "@/app/components/forms/documents/UploadsByCategory";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import WarningRequiredFields from "@/app/components/forms/WarningRequiredFields";
import { MaxSizeNotice } from "@/app/components/forms/MaxSizeNotice";
import { SubmitError } from "@/app/components/SubmitError";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import {
  getCategoriesDisplayRules,
  getCategoriesToDisplay,
} from "@/app/utils/categoryToDisplay.util";
import { getQualiteFormDefaultValues } from "@/app/utils/defaultValues.util";
import { filterFileUploads } from "@/app/utils/filterFileUploads.util";
import {
  FinalisationQualiteFormValues,
  finalisationQualiteSchema,
} from "@/schemas/finalisation/finalisationQualite.schema";
import { StructureState } from "@/types/structure.type";

import { useStructureContext } from "../../context/StructureClientContext";
import { getCurrentStepData } from "../components/Steps";

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

  const { handleSubmit, state, backendError } = useAgentFormHandling({
    nextRoute,
  });

  const defaultValues = getQualiteFormDefaultValues({
    structure,
    categoriesToDisplay,
  });

  const onSubmit = async (
    data: FinalisationQualiteFormValues,
    methods: UseFormReturn<FinalisationQualiteFormValues>
  ) => {
    const fileUploads = filterFileUploads(
      data.fileUploads,
      methods,
      categoriesDisplayRules
    );

    const controles = data.controles?.map((controle) => {
      return {
        id: controle.id || undefined,
        date: controle.date,
        type: controle.type,
        fileUploadKey: controle.fileUploads?.[0].key,
      };
    });

    await handleSubmit({
      fileUploads,
      controles,
      dnaCode: structure.dnaCode,
    });
  };

  return (
    <FormWrapper
      schema={finalisationQualiteSchema}
      onSubmit={onSubmit}
      submitButtonText="Étape suivante"
      previousStep={previousRoute}
      availableFooterButtons={[FooterButtonType.SUBMIT]}
      defaultValues={defaultValues}
    >
      <WarningRequiredFields structure={structure} />

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
              additionalFieldsType={
                categoriesDisplayRules[category].additionalFieldsType
              }
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
