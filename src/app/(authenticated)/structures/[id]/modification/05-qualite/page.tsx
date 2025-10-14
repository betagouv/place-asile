"use client";
import Notice from "@codegouvfr/react-dsfr/Notice";

import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import UploadsByCategory from "@/app/components/forms/qualite/UploadsByCategory";
import { SubmitError } from "@/app/components/SubmitError";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getCategoriesDisplayRules } from "@/app/utils/categoryToDisplay.util";
import { getQualiteFormDefaultValues } from "@/app/utils/defaultValues.util";
import { finalisationQualiteSchema } from "@/schemas/finalisation/finalisationQualite.schema";
import { DdetsFileUploadCategoryType } from "@/types/file-upload.type";

import { useStructureContext } from "../../context/StructureClientContext";
import { ModificationTitle } from "../components/ModificationTitle";

export default function ModificationQualiteForm() {
  const { structure } = useStructureContext();

  const categoriesToDisplay: DdetsFileUploadCategoryType[number][] = [
    "INSPECTION_CONTROLE",
  ];

  const categoriesDisplayRules = getCategoriesDisplayRules(structure);

  const { handleQualiteFormSubmit, state, backendError } = useAgentFormHandling(
    {
      nextRoute: `/structures/${structure.id}`,
      categoriesDisplayRules,
    }
  );

  const defaultValues = getQualiteFormDefaultValues({
    structure,
    categoriesToDisplay,
  });

  return (
    <>
      <ModificationTitle
        step="Contrôle qualité"
        closeLink={`/structures/${structure.id}`}
      />
      <FormWrapper
        schema={finalisationQualiteSchema}
        onSubmit={handleQualiteFormSubmit}
        submitButtonText="Valider"
        resetRoute={`/structures/${structure.id}`}
        availableFooterButtons={[FooterButtonType.SUBMIT]}
        defaultValues={defaultValues}
      >
        <Notice
          severity="info"
          title=""
          description="Les Évaluations et les Évènements Indésirables Graves sont renseignés à partir du DNA. Il y a une erreur ? Contactez-nous."
        />

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
