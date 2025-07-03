import React from "react";
import { getCurrentStepData } from "@/app/(authenticated)/structures/[id]/finalisation/components/Steps";
import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import FormWrapper, { FooterButtonType } from "@/app/components/forms/FormWrapper";
import {
  finalisationFinanceSchema,
  FinalisationFinanceFormValues,
} from "./validation/finalisationFinanceSchema";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { Documents } from "./components/Documents";
import { IndicateursGeneraux } from "./components/IndicateursGeneraux";
import { useYearRange } from "@/app/hooks/useYearRange";
import { useDateStringToYear } from "@/app/hooks/useDateStringToYear";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { BudgetTables } from "./components/BudgetTables";

export default function FinalisationFinanceForm({
  currentStep,
}: {
  currentStep: number;
}) {
  const { years } = useYearRange();
  const { dateStringToYear } = useDateStringToYear();
  const { structure } = useStructureContext();
  const { nextRoute, previousRoute } = getCurrentStepData(
    currentStep,
    structure.id
  );

  const budgetsFilteredByYears =
    structure?.budgets?.filter((budget) =>
      years.includes(Number(dateStringToYear(budget.date.toString())))
    ) || [];
  const defaultValues: Partial<FinalisationFinanceFormValues> = {
    budget: budgetsFilteredByYears.map((budget) => ({
      ...budget,
    })),
  };

  return (
    <FormWrapper
      schema={finalisationFinanceSchema}
      nextRoute={nextRoute}
      defaultValues={defaultValues}
      submitButtonText="Étape suivante"
      previousStep={previousRoute}
      availableFooterButtons={[FooterButtonType.Submit]}
    >
      <InformationBar
        variant="warning"
        title="À vérifier"
        description="Veuillez vérifier les informations et/ou les documents suivants transmis par l’opérateur."
      />
      <Documents className="mb-6" />
      <InformationBar
        variant="info"
        title="À compléter"
        description="Veuillez remplir les champs obligatoires ci-dessous. Si une donnée vous est inconnue, contactez-nous."
      />
      <IndicateursGeneraux />
      {/* TODO: ajouter le tutoriel */}
      <Notice
        severity="warning"
        title=""
        className="rounded [&_p]:flex  [&_p]:items-center mb-8"
        description="La complétion de cette partie étant complexe, veuillez vous référer au tutoriel que nous avons créé pour vous guider à cette fin."
      />
      <BudgetTables />
    </FormWrapper>
  );
}
