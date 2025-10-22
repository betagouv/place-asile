"use client";

import { AutoSave } from "@/app/components/forms/AutoSave";
import { Disclaimer } from "@/app/components/forms/documents/Disclaimer";
import UploadsByCategory from "@/app/components/forms/documents/UploadsByCategory";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { MaxSizeNotice } from "@/app/components/forms/MaxSizeNotice";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useFetchState } from "@/app/context/FetchStateContext";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import {
  getCategoriesDisplayRules,
  getCategoriesToDisplay,
} from "@/app/utils/categoryToDisplay.util";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import {
  FileUploadsAutoSaveFormValues,
  fileUploadsAutoSaveSchema,
  fileUploadsSchema,
} from "@/schemas/base/documents.schema";
import { FetchState } from "@/types/fetch-state.type";

import { useStructureContext } from "../../_context/StructureClientContext";
import { Tabs } from "../_components/Tabs";

export default function FinalisationQualite() {
  const { structure } = useStructureContext();

  const currentStep = "05-documents";

  const categoriesToDisplay = getCategoriesToDisplay(structure).filter(
    (category) => category !== "INSPECTION_CONTROLE"
  );

  const categoriesDisplayRules = getCategoriesDisplayRules(structure);

  const { handleValidation, handleAutoSave, backendError } =
    useAgentFormHandling({ currentStep });

  const defaultValues = getDefaultValues({
    structure,
  });

  const onAutoSave = async (data: FileUploadsAutoSaveFormValues) => {
    const fileUploads = data.fileUploads?.filter(
      (fileUpload) => fileUpload.key
    );

    await handleAutoSave({
      fileUploads: fileUploads,
      dnaCode: structure.dnaCode,
    });
  };

  const { getFetchState } = useFetchState();
  const saveState = getFetchState("structure-save");

  return (
    <div>
      <Tabs currentStep={currentStep} />
      <FormWrapper
        schema={fileUploadsSchema}
        onSubmit={handleValidation}
        submitButtonText="Étape suivante"
        availableFooterButtons={[FooterButtonType.SUBMIT]}
        defaultValues={defaultValues}
        className="rounded-t-none"
      >
        <AutoSave schema={fileUploadsAutoSaveSchema} onSave={onAutoSave} />
        <InformationBar
          variant="complete"
          title="À compléter"
          description="Veuillez importer l’ensemble des actes administratifs historiques afférents à la structure, que les dates d’effets soient actuelles ou révolues."
        />

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
              {index < categoriesToDisplay.length - 1 && (
                <hr className="mt-13" />
              )}
            </div>
          );
        })}
        {saveState === FetchState.ERROR && (
          <SubmitError
            structureDnaCode={structure.dnaCode}
            backendError={backendError}
          />
        )}
      </FormWrapper>
    </div>
  );
}
