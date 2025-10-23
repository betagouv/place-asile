"use client";
import { useStructureContext } from "@/app/(authenticated)/structures/[id]/_context/StructureClientContext";
import { BudgetTables } from "@/app/components/forms/finance/BudgetTables";
import { DocumentsAccordion } from "@/app/components/forms/finance/documents/DocumentsAccordion";
import { IndicateursGeneraux } from "@/app/components/forms/finance/IndicateursGeneraux";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { useFetchState } from "@/app/context/FetchStateContext";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { getDefaultValues } from "@/app/utils/defaultValues.util";
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

import { ModificationTitle } from "../components/ModificationTitle";

export default function ModificationFinanceForm() {
  const { structure } = useStructureContext();

  const hasCpom = structure?.cpom;
  const isAutorisee = isStructureAutorisee(structure?.type);
  const isSubventionnee = isStructureSubventionnee(structure?.type);

  let schema;

  if (isAutorisee) {
    schema = hasCpom ? autoriseeAvecCpomSchema : autoriseeSchema;
  } else if (isSubventionnee) {
    schema = hasCpom ? subventionneeAvecCpomSchema : subventionneeSchema;
  }

  const defaultValues = getDefaultValues({ structure });

  const { handleSubmit, backendError } = useAgentFormHandling({
    nextRoute: `/structures/${structure.id}`,
  });

  const onSubmit = (data: anyFinanceFormValues) => {
    data.budgets.forEach((budget) => {
      if (budget.id === "") {
        delete budget.id;
      }
    });
    handleSubmit({ ...data, dnaCode: structure.dnaCode });
  };

  const { getFetchState } = useFetchState();
  const saveState = getFetchState("structure-save");

  return (
    <>
      <ModificationTitle
        step="Finances"
        closeLink={`/structures/${structure.id}`}
      />
      <FormWrapper
        schema={schema || basicSchema}
        defaultValues={defaultValues as unknown as anyFinanceFormValues}
        resetRoute={`/structures/${structure.id}`}
        submitButtonText="Valider"
        availableFooterButtons={[
          FooterButtonType.CANCEL,
          FooterButtonType.SUBMIT,
        ]}
        onSubmit={onSubmit}
        className="border-[2px] border-solid border-[var(--text-title-blue-france)]"
      >
        <DocumentsAccordion className="mb-6" />
        <IndicateursGeneraux />
        <hr />

        <BudgetTables />
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
