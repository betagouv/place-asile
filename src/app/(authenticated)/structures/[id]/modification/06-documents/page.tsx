"use client";
import { UseFormReturn } from "react-hook-form";

import UploadsByCategory from "@/app/components/forms/documents/UploadsByCategory";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { MaxSizeNotice } from "@/app/components/forms/MaxSizeNotice";
import { SubmitError } from "@/app/components/SubmitError";
import { useFetchState } from "@/app/context/FetchStateContext";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import {
  getCategoriesDisplayRules,
  getCategoriesToDisplay,
} from "@/app/utils/categoryToDisplay.util";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import { filterFileUploads } from "@/app/utils/filterFileUploads.util";
import {
  FileUploadsFormValues,
  fileUploadsSchema,
} from "@/schemas/base/documents.schema";
import { FetchState } from "@/types/fetch-state.type";

import { useStructureContext } from "../../context/StructureClientContext";
import { ModificationTitle } from "../components/ModificationTitle";

export default function ModificationQualiteForm() {
  const { structure } = useStructureContext();

  const categoriesToDisplay = getCategoriesToDisplay(structure).filter(
    (category) => category !== "INSPECTION_CONTROLE"
  );

  const categoriesDisplayRules = getCategoriesDisplayRules(structure);

  const { handleSubmit, backendError } = useAgentFormHandling({
    nextRoute: `/structures/${structure.id}`,
  });

  const defaultValues = getDefaultValues({
    structure,
  });

  const onSubmit = async (
    data: FileUploadsFormValues,
    methods: UseFormReturn<FileUploadsFormValues>
  ) => {
    const fileUploads = await filterFileUploads(
      data.fileUploads,
      methods,
      categoriesDisplayRules
    );

    await handleSubmit({
      fileUploads,
      dnaCode: structure.dnaCode,
    });
  };

  const { getFetchState } = useFetchState();
  const saveState = getFetchState("structure-save");

  return (
    <>
      <ModificationTitle
        step="Actes administratifs"
        closeLink={`/structures/${structure.id}`}
      />
      <FormWrapper
        schema={fileUploadsSchema}
        onSubmit={onSubmit}
        submitButtonText="Valider"
        resetRoute={`/structures/${structure.id}`}
        availableFooterButtons={[FooterButtonType.SUBMIT]}
        defaultValues={defaultValues}
        className="border-[2px] border-solid border-[var(--text-title-blue-france)]"
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
                additionalFieldsType={
                  categoriesDisplayRules[category].additionalFieldsType
                }
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
        {saveState === FetchState.ERROR && (
          <SubmitError
            structureDnaCode={structure.dnaCode}
            backendError={backendError}
          />
        )}
      </FormWrapper>
    </>
  );
}
