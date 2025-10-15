"use client";
import { UseFormReturn } from "react-hook-form";

import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { MaxSizeNotice } from "@/app/components/forms/MaxSizeNotice";
import UploadsByCategory from "@/app/components/forms/documents/UploadsByCategory";
import { SubmitError } from "@/app/components/SubmitError";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import {
  getCategoriesDisplayRules,
  getCategoriesToDisplay,
} from "@/app/utils/categoryToDisplay.util";
import { getQualiteFormDefaultValues } from "@/app/utils/defaultValues.util";
import { filterFileUploads } from "@/app/utils/filterFileUploads.util";
import {
  ModificationDocumentFormValues,
  modificationDocumentSchema,
} from "@/schemas/modification/modificationDocument.schema";

import { useStructureContext } from "../../context/StructureClientContext";
import { ModificationTitle } from "../components/ModificationTitle";

export default function ModificationQualiteForm() {
  const { structure } = useStructureContext();

  const categoriesToDisplay = getCategoriesToDisplay(structure).filter(
    (category) => category !== "INSPECTION_CONTROLE"
  );

  const categoriesDisplayRules = getCategoriesDisplayRules(structure);

  const { handleSubmit, state, backendError } = useAgentFormHandling({
    nextRoute: `/structures/${structure.id}`,
  });

  const defaultValues = getQualiteFormDefaultValues({
    structure,
    categoriesToDisplay,
  });

  const onSubmit = async (
    data: ModificationDocumentFormValues,
    methods: UseFormReturn<ModificationDocumentFormValues>
  ) => {
    const fileUploads = filterFileUploads(
      data.fileUploads,
      methods,
      categoriesDisplayRules
    );

    await handleSubmit({
      fileUploads,
      dnaCode: structure.dnaCode,
    });
  };

  return (
    <>
      <ModificationTitle
        step="Actes administratifs"
        closeLink={`/structures/${structure.id}`}
      />
      <FormWrapper
        schema={modificationDocumentSchema}
        onSubmit={onSubmit}
        submitButtonText="Valider"
        resetRoute={`/structures/${structure.id}`}
        availableFooterButtons={[FooterButtonType.SUBMIT]}
        defaultValues={defaultValues}
      >
        <MaxSizeNotice />

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
    </>
  );
}
