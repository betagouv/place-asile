"use client";
import { useStructureContext } from "@/app/(authenticated)/structures/[id]/_context/StructureClientContext";
import { AutoSave } from "@/app/components/forms/AutoSave";
import { Documents } from "@/app/components/forms/finance/documents/Documents";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useFetchState } from "@/app/context/FetchStateContext";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
import {
  DocumentsFinanciersFlexibleFormValues,
  DocumentsFinanciersFlexibleSchema,
} from "@/schemas/base/documentsFinanciers.schema";
import { FetchState } from "@/types/fetch-state.type";

import { Tabs } from "../_components/Tabs";

export default function FinalisationDocumentsFinanciers() {
  const { structure } = useStructureContext();

  const currentStep = "02-documents-financiers";

  const defaultValues = getDefaultValues({ structure });

  const { handleValidation, handleAutoSave, backendError } =
    useAgentFormHandling();

  const onAutoSave = async (data: DocumentsFinanciersFlexibleFormValues) => {
    const fileUploads = data.fileUploads.filter((fileUpload) => fileUpload.key);

    await handleAutoSave({ ...data, fileUploads, dnaCode: structure.dnaCode });
  };

  const { getFetchState } = useFetchState();
  const saveState = getFetchState("structure-save");

  return (
    <div>
      <Tabs currentStep={currentStep} structure={structure} />
      <FormWrapper
        schema={DocumentsFinanciersFlexibleSchema}
        defaultValues={
          defaultValues as unknown as DocumentsFinanciersFlexibleFormValues
        }
        submitButtonText="Je valide la saisie de cette page"
        availableFooterButtons={[FooterButtonType.SUBMIT]}
        onSubmit={handleValidation}
        className="rounded-t-none"
      >
        <AutoSave
          schema={DocumentsFinanciersFlexibleSchema}
          onSave={onAutoSave}
        />
        <InformationBar
          variant="verify"
          title="À vérifier"
          description="Veuillez vérifier les documents financiers fournis par l’opérateur concernant les cinq dernières années."
        />

        <Documents className="mb-6" />

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
