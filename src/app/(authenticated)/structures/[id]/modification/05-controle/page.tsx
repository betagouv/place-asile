"use client";
import Notice from "@codegouvfr/react-dsfr/Notice";

import UploadsByCategory from "@/app/components/forms/documents/UploadsByCategory";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { useFetchState } from "@/app/context/FetchStateContext";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getCategoriesDisplayRules } from "@/app/utils/categoryToDisplay.util";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import {
  ControlesFormValues,
  controlesSchema,
} from "@/schemas/base/controles.schema";
import { FetchState } from "@/types/fetch-state.type";

import { useStructureContext } from "../../_context/StructureClientContext";
import { ModificationTitle } from "../components/ModificationTitle";

export default function ModificationControleForm() {
  const { structure } = useStructureContext();

  const categoriesDisplayRules = getCategoriesDisplayRules(structure);

  const { handleSubmit, backendError } = useAgentFormHandling({
    nextRoute: `/structures/${structure.id}`,
  });

  const defaultValues = getDefaultValues({
    structure,
  });

  const onSubmit = async (data: ControlesFormValues) => {
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

  const { getFetchState } = useFetchState();
  const saveState = getFetchState("structure-save");

  return (
    <>
      <ModificationTitle
        step="Contrôle qualité"
        closeLink={`/structures/${structure.id}`}
      />
      <FormWrapper
        schema={controlesSchema}
        onSubmit={onSubmit}
        submitButtonText="Valider"
        resetRoute={`/structures/${structure.id}`}
        availableFooterButtons={[FooterButtonType.SUBMIT]}
        defaultValues={defaultValues}
        className="border-[2px] border-solid border-[var(--text-title-blue-france)]"
      >
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
