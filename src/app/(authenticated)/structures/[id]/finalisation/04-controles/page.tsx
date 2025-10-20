"use client";
import Notice from "@codegouvfr/react-dsfr/Notice";

import UploadsByCategory from "@/app/components/forms/documents/UploadsByCategory";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getCategoriesDisplayRules } from "@/app/utils/categoryToDisplay.util";
import { getFileUploadsDefaultValues } from "@/app/utils/defaultValues.util";
import {
  ModificationControleFormValues,
  modificationControleSchema,
} from "@/schemas/modification/modificationControle.schema";
import { FetchState } from "@/types/fetch-state.type";

import { useStructureContext } from "../../context/StructureClientContext";
import { Tabs } from "../_components/Tabs";

export default function ModificationControleForm() {
  const { structure } = useStructureContext();

  const currentStep = 4;

  const categoriesDisplayRules = getCategoriesDisplayRules(structure);

  const { handleSubmit, state, backendError } = useAgentFormHandling({
    nextRoute: `/structures/${structure.id}`,
  });

  const defaultValues = getFileUploadsDefaultValues({
    structure,
    categoriesToDisplay: ["INSPECTION_CONTROLE"],
  });

  const onSubmit = async (data: ModificationControleFormValues) => {
    const controles = data.controles?.map((controle) => {
      return {
        id: controle.id || undefined,
        date: controle.date,
        type: controle.type,
        fileUploadKey: controle.fileUploads?.[0].key,
      };
    });

    await handleSubmit({
      controles,
      dnaCode: structure.dnaCode,
    });
  };

  return (
    <div>
      <Tabs currentStep={currentStep} structure={structure} />
      <FormWrapper
        schema={modificationControleSchema}
        onSubmit={onSubmit}
        submitButtonText="Valider"
        resetRoute={`/structures/${structure.id}`}
        availableFooterButtons={[FooterButtonType.SUBMIT]}
        defaultValues={defaultValues}
        className="rounded-t-none"
      >
        <InformationBar
          variant="complete"
          title="À compléter"
          description="Veuillez renseigner les informations et documents concernant l’ensemble des évaluations et inspections-contrôles auxquelles la structure a été soumise, et remplir les autres champs obligatoires ci-dessous."
        />
        <Notice
          severity="info"
          title=""
          description="Les Évaluations et les Évènements Indésirables Graves sont renseignés à partir du DNA. Il y a une erreur ? Contactez-nous."
        />
        <UploadsByCategory
          category={"INSPECTION_CONTROLE"}
          categoryShortName={
            categoriesDisplayRules["INSPECTION_CONTROLE"].categoryShortName
          }
          title={categoriesDisplayRules["INSPECTION_CONTROLE"].title}
          canAddFile={categoriesDisplayRules["INSPECTION_CONTROLE"].canAddFile}
          canAddAvenant={
            categoriesDisplayRules["INSPECTION_CONTROLE"].canAddAvenant
          }
          isOptional={false}
          additionalFieldsType={
            categoriesDisplayRules["INSPECTION_CONTROLE"].additionalFieldsType
          }
          documentLabel={
            categoriesDisplayRules["INSPECTION_CONTROLE"].documentLabel
          }
          addFileButtonLabel={
            categoriesDisplayRules["INSPECTION_CONTROLE"].addFileButtonLabel
          }
          notice={categoriesDisplayRules["INSPECTION_CONTROLE"].notice}
        />
        {state === FetchState.ERROR && (
          <SubmitError
            structureDnaCode={structure.dnaCode}
            backendError={backendError}
          />
        )}
      </FormWrapper>
    </div>
  );
}
