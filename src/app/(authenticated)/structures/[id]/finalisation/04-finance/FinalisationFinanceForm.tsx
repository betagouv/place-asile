"use client";
import React, { useState } from "react";
import { getCurrentStepData } from "@/app/(authenticated)/structures/[id]/finalisation/components/Steps";
import { useStructureContext } from "@/app/(authenticated)/structures/[id]/context/StructureClientContext";
import FormWrapper, {
  FooterButtonType,
} from "@/app/components/forms/FormWrapper";
import {
  autoriseeSchema,
  autoriseeAvecCpomSchema,
  subventionneeAvecCpomSchema,
  subventionneeSchema,
  basicSchema,
  anyFinanceFormValues,
} from "./validation/finalisationFinanceSchema";
import { InformationBar } from "@/app/components/ui/InformationBar";
import { Documents } from "./components/documents/Documents";
import { IndicateursGeneraux } from "./components/IndicateursGeneraux";
import { useYearRange } from "@/app/hooks/useYearRange";
import { useDateStringToYear } from "@/app/hooks/useDateStringToYear";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { BudgetTables } from "./components/BudgetTables";
import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";
import { useStructures } from "@/app/hooks/useStructures";
import { useRouter } from "next/navigation";
import { SubmitError } from "@/app/components/SubmitError";

export default function FinalisationFinanceForm({
  currentStep,
}: {
  currentStep: number;
}) {
  const { years } = useYearRange();
  const { dateStringToYear } = useDateStringToYear();
  const { structure } = useStructureContext();
  const hasCpom = structure?.cpom;
  const isAutorisee = isStructureAutorisee(structure?.type);
  const isSubventionnee = isStructureSubventionnee(structure?.type);
  const { updateStructure } = useStructures();
  const router = useRouter();

  const { nextRoute, previousRoute } = getCurrentStepData(
    currentStep,
    structure.id
  );

  let schema;

  if (isAutorisee) {
    schema = hasCpom ? autoriseeAvecCpomSchema : autoriseeSchema;
  } else if (isSubventionnee) {
    schema = hasCpom ? subventionneeAvecCpomSchema : subventionneeSchema;
  }

  const budgetsFilteredByYears =
    structure?.budgets?.filter((budget) =>
      years.includes(Number(dateStringToYear(budget.date.toString())))
    ) || [];

  const budgetArray = Array(5)
    .fill({})
    .map((emptyBudget, index) =>
      index < budgetsFilteredByYears.length
        ? budgetsFilteredByYears[index]
        : emptyBudget
    );

  const defaultValues = {
    budgets: budgetArray as unknown as anyFinanceFormValues["budgets"],
    fileUploads: structure.fileUploads,
  };

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [backendError, setBackendError] = useState<string | undefined>("");

  const handleSubmit = async (data: anyFinanceFormValues) => {
    setState("loading");
    // TODO : supprimer les id string vides à la source
    data.budgets.forEach((budget) => {
      if (budget.id === "") {
        delete budget.id;
      }
    });
    const updatedStructure = await updateStructure({
      ...data,
      dnaCode: structure.dnaCode,
    });
    if (updatedStructure === "OK") {
      router.push(nextRoute);
    } else {
      setState("error");
      setBackendError(updatedStructure?.toString());
      throw new Error(updatedStructure?.toString());
    }
  };

  return (
    <FormWrapper
      schema={schema || basicSchema}
      defaultValues={defaultValues as unknown as anyFinanceFormValues}
      submitButtonText="Étape suivante"
      previousStep={previousRoute}
      availableFooterButtons={[FooterButtonType.SUBMIT]}
      onSubmit={handleSubmit}
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
        className="rounded [&_p]:flex [&_p]:items-center mb-8 w-fit [&_.fr-notice\_\_desc]:text-text-default-grey"
        description="La complétion de cette partie étant complexe, veuillez vous référer au tutoriel que nous avons créé pour vous guider à cette fin."
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
