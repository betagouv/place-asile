"use client";
import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { AutoSave } from "@/app/components/forms/AutoSave";
import { Documents } from "@/app/components/forms/finance/documents/Documents";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getFinanceFormDefaultValues } from "@/app/utils/defaultValues.util";
import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";
import {
  anyFinanceFormValues,
  autoriseeAvecCpomSchema,
  autoriseeSchema,
  basicSchema,
  subventionneeAvecCpomSchema,
  subventionneeSchema,
} from "@/schemas/base/finance.schema";
import { FetchState } from "@/types/fetch-state.type";

import { Tabs } from "../_components/Tabs";

export default function FinalisationDocumentsFinanciers() {
  const { structure } = useStructureContext();

  const currentStep = 2;

  const hasCpom = structure?.cpom;
  const isAutorisee = isStructureAutorisee(structure?.type);
  const isSubventionnee = isStructureSubventionnee(structure?.type);

  let schema;

  if (isAutorisee) {
    schema = hasCpom ? autoriseeAvecCpomSchema : autoriseeSchema;
  } else if (isSubventionnee) {
    schema = hasCpom ? subventionneeAvecCpomSchema : subventionneeSchema;
  }

  const defaultValues = getFinanceFormDefaultValues({ structure });

  const { handleValidation, handleAutoSave, state, backendError } =
    useAgentFormHandling();

  const onAutoSave = async (data: anyFinanceFormValues) => {
    data.budgets.forEach((budget) => {
      if (budget.id === "") {
        delete budget.id;
      }
    });
    await handleAutoSave({ ...data, dnaCode: structure.dnaCode });
  };

  return (
    <div>
      <Tabs currentStep={currentStep} structure={structure} />
      <FormWrapper
        schema={schema || basicSchema}
        defaultValues={defaultValues as unknown as anyFinanceFormValues}
        submitButtonText="Je valide la saisie de cette page"
        availableFooterButtons={[FooterButtonType.SUBMIT]}
        onSubmit={handleValidation}
        className="rounded-t-none"
      >
        <AutoSave
          schema={schema || basicSchema}
          onSave={onAutoSave}
          state={state}
        />
        <InformationBar
          variant="verify"
          title="À vérifier"
          description="Veuillez vérifier les documents financiers fournis par l’opérateur concernant les cinq dernières années."
        />

        <Documents className="mb-6" />

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
