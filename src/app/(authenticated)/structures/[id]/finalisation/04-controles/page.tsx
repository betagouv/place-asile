"use client";

import { AutoSave } from "@/app/components/forms/AutoSave";
import UploadsByCategory from "@/app/components/forms/documents/UploadsByCategory";
import { Evaluations } from "@/app/components/forms/evaluations/Evaluations";
import { FieldSetOuvertureFermeture } from "@/app/components/forms/fieldsets/structure/FieldSetOuvertureFermeture";
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
import { isStructureAutorisee } from "@/app/utils/structure.util";
import { ControleApiType } from "@/schemas/api/controle.schema";
import { EvaluationApiType } from "@/schemas/api/evaluation.schema";
import {
  FinalisationQualiteAutoSaveFormValues,
  finalisationQualiteAutoSaveSchema,
  finalisationQualiteSchema,
} from "@/schemas/forms/finalisation/finalisationQualite.schema";
import { FetchState } from "@/types/fetch-state.type";
import { StepStatus } from "@/types/form.type";
import { FormKind } from "@/types/global";

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

  const { handleValidation, handleAutoSave, backendError } =
    useAgentFormHandling({
      currentStep,
    });

  const defaultValues = getDefaultValues({
    structure,
  });

  const onAutoSave = async (data: FinalisationQualiteAutoSaveFormValues) => {
    const controles: ControleApiType[] | undefined = data.controles?.map(
      (controle) => {
        return {
          id: controle.id ?? undefined,
          date: controle.date,
          type: controle.type,
          fileUploadKey: controle.fileUploads?.[0]?.key,
        };
      }
    );

    const evaluations: EvaluationApiType[] | undefined = data.evaluations?.map(
      (evaluation) => {
        return {
          ...evaluation,
          id: evaluation.id || undefined,
          fileUploads: evaluation.fileUploads?.filter(
            (fileUpload) =>
              fileUpload?.key !== undefined && fileUpload?.id !== undefined
          ) as { id: number; key: string }[] | undefined,
        };
      }
    );

    await handleAutoSave({
      ...data,
      controles,
      evaluations,
      dnaCode: structure.dnaCode,
    });
  };

  const { getFetchState } = useFetchState();
  const saveState = getFetchState("structure-save");

  return (
    <div>
      <Tabs currentStep={currentStep} />
      <FormWrapper
        schema={finalisationQualiteSchema}
        onSubmit={handleValidation}
        submitButtonText="Valider"
        resetRoute={`/structures/${structure.id}`}
        availableFooterButtons={[FooterButtonType.SUBMIT]}
        defaultValues={defaultValues}
        className="rounded-t-none"
      >
        <AutoSave
          schema={finalisationQualiteAutoSaveSchema}
          onSave={onAutoSave}
        />
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
        {isStructureAutorisee(structure.type) && (
          <>
            <Evaluations />
            <hr />
          </>
        )}

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
        <hr />
        <FieldSetOuvertureFermeture formKind={FormKind.FINALISATION} />
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
