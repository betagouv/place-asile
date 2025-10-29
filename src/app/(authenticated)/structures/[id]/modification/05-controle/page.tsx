"use client";
import Notice from "@codegouvfr/react-dsfr/Notice";

import UploadsByCategory from "@/app/components/forms/documents/UploadsByCategory";
import { Evaluations } from "@/app/components/forms/evaluations/Evaluations";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { useFetchState } from "@/app/context/FetchStateContext";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getCategoriesDisplayRules } from "@/app/utils/categoryToDisplay.util";
import { transformFormControlesToApiControles } from "@/app/utils/controle.util";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import { transformFormEvaluationsToApiEvaluations } from "@/app/utils/evaluation.util";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import { PLACE_ASILE_CONTACT_EMAIL } from "@/constants";
import {
  ModificationQualiteFormValues,
  modificationQualiteSchema,
} from "@/schemas/forms/modification/modificationQualite.schema";
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

  const onSubmit = async (data: ModificationQualiteFormValues) => {
    const controles = transformFormControlesToApiControles(data.controles);

    const evaluations = transformFormEvaluationsToApiEvaluations(
      data.evaluations
    );

    await handleSubmit({
      controles,
      evaluations,
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
        schema={modificationQualiteSchema}
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
          description={`Actuellement, seuls les EIG renseignés sur Démarches Simplifiées sont affichés, l’ancienneté de cet historique dépend donc de la date à laquelle votre région a été articulée avec l’outil. Les EIG sont récupérés automatiquement. Il y a une erreur ? Contactez-nous : ${PLACE_ASILE_CONTACT_EMAIL}`}
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
