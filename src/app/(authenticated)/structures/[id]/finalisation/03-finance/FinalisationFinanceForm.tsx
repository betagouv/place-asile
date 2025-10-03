"use client";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import Link from "next/link";

import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import { getCurrentStepData } from "@/app/(authenticated)/structures/[id]/finalisation/components/Steps";
import { BudgetTables } from "@/app/components/financeForm/BudgetTables";
import { Documents } from "@/app/components/financeForm/documents/Documents";
import { IndicateursGeneraux } from "@/app/components/financeForm/IndicateursGeneraux";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import { SubmitError } from "@/app/components/SubmitError";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { useAgentFormHandling } from "@/app/hooks/useAgentFormHandling";
import { useFinanceDocument } from "@/app/hooks/useFinanceDocument";
import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";
import { getFinanceFormTutorialLink } from "@/app/utils/tutorials.util";
import { StructureState } from "@/types/structure.type";

import {
  anyFinanceFormValues,
  autoriseeAvecCpomSchema,
  autoriseeSchema,
  basicSchema,
  subventionneeAvecCpomSchema,
  subventionneeSchema,
} from "./validation/finalisationFinanceSchema";

export default function FinalisationFinanceForm({
  currentStep,
}: {
  currentStep: number;
}) {
  const { structure } = useStructureContext();

  const hasCpom = structure?.cpom;
  const isAutorisee = isStructureAutorisee(structure?.type);
  const isSubventionnee = isStructureSubventionnee(structure?.type);

  const { nextRoute, previousRoute } = getCurrentStepData(
    currentStep,
    structure.id
  );

  const { budgetArray, buildFileUploadsDefaultValues } = useFinanceDocument({
    structure,
    isAutorisee,
  });

  let schema;

  if (isAutorisee) {
    schema = hasCpom ? autoriseeAvecCpomSchema : autoriseeSchema;
  } else if (isSubventionnee) {
    schema = hasCpom ? subventionneeAvecCpomSchema : subventionneeSchema;
  }

  const defaultValues = {
    budgets: budgetArray as unknown as anyFinanceFormValues["budgets"],
    fileUploads: buildFileUploadsDefaultValues(),
  };

  const { handleSubmit, state, backendError } = useAgentFormHandling({
    nextRoute,
  });

  return (
    <FormWrapper
      schema={schema || basicSchema}
      defaultValues={defaultValues as unknown as anyFinanceFormValues}
      submitButtonText="Étape suivante"
      previousStep={previousRoute}
      availableFooterButtons={[FooterButtonType.SUBMIT]}
      onSubmit={(data) => {
        data.budgets.forEach((budget) => {
          if (budget.id === "") {
            delete budget.id;
          }
        });
        handleSubmit({
          ...data,
          dnaCode: structure.dnaCode,
        });
      }}
      className="w-full"
    >
      {structure.state === StructureState.A_FINALISER && (
        <InformationBar
          variant="warning"
          title="À vérifier"
          description="Veuillez vérifier les informations et/ou les documents suivants transmis par l’opérateur."
        />
      )}
      <Documents className="mb-6" />
      {structure.state === StructureState.A_FINALISER && (
        <InformationBar
          variant="info"
          title="À compléter"
          description="Veuillez remplir les champs obligatoires ci-dessous. Si une donnée vous est inconnue, contactez-nous."
        />
      )}
      <IndicateursGeneraux />
      <hr />
      <Notice
        severity="warning"
        title=""
        className="rounded [&_p]:flex [&_p]:items-center mb-8 w-fit [&_.fr-notice\_\_desc]:text-text-default-grey"
        description={
          <>
            La complétion de cette partie étant complexe, veuillez vous référer{" "}
            <Link
              href={getFinanceFormTutorialLink({
                isAutorisee,
                isSubventionnee,
                hasCpom,
              })}
              target="_blank"
              className="underline"
            >
              au tutoriel que nous avons créé pour vous guider à cette fin
            </Link>
            .
          </>
        }
      />
      <BudgetTables />
      {state === "error" && (
        <SubmitError
          structureDnaCode={structure.dnaCode}
          backendError={backendError}
        />
      )}
    </FormWrapper>
  );
}
