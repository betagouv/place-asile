"use client";

import Notice from "@codegouvfr/react-dsfr/Notice";

import UploadsByCategory from "@/app/components/forms/documents/UploadsByCategory";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useFetchState } from "@/app/context/FetchStateContext";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getCategoriesDisplayRules } from "@/app/utils/categoryToDisplay.util";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import { getFinalisationFormStepStatus } from "@/app/utils/getFinalisationFormStatus.util";
import { controlesSchema } from "@/schemas/forms/base/controles.schema";
import { FetchState } from "@/types/fetch-state.type";
import { StepStatus } from "@/types/form.type";

import { useStructureContext } from "../../_context/StructureClientContext";
import { Tabs } from "../_components/Tabs";

export default function ModificationControleForm() {
  const { structure } = useStructureContext();

  const currentStep = "04-controles";

  const currentFormStepStatus = getFinalisationFormStepStatus(
    currentStep,
    structure
  );

  const categoriesDisplayRules = getCategoriesDisplayRules(structure);

  const { handleValidation, backendError } = useAgentFormHandling({
    currentStep,
  });

  const defaultValues = getDefaultValues({
    structure,
  });

  // const onSubmit = async (data: ControlesFormValues) => {
  //   const controles = data.controles?.map((controle) => {
  //     return {
  //       id: controle.id || undefined,
  //       date: controle.date,
  //       type: controle.type,
  //       fileUploadKey: controle.fileUploads?.[0].key,
  //     };
  //   });

  //   // await handleSubmit({
  //   //   controles,
  //   //   dnaCode: structure.dnaCode,
  //   // });
  // };

  const { getFetchState } = useFetchState();
  const saveState = getFetchState("structure-save");

  return (
    <div>
      <Tabs currentStep={currentStep} />
      <FormWrapper
        schema={controlesSchema}
        onSubmit={handleValidation}
        submitButtonText="Valider"
        resetRoute={`/structures/${structure.id}`}
        availableFooterButtons={[FooterButtonType.SUBMIT]}
        defaultValues={defaultValues}
        className="rounded-t-none"
      >
        <InformationBar
          variant={
            currentFormStepStatus === StepStatus.VALIDE ? "success" : "complete"
          }
          title={
            currentFormStepStatus === StepStatus.VALIDE
              ? "Complété"
              : "À compléter"
          }
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
