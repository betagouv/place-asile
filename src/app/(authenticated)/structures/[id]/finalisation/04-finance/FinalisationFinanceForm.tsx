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
import Link from "next/link";
import { useDocumentIndex } from "@/app/hooks/useDocumentIndex";
import {
  structureAutoriseesDocuments,
  structureSubventionneesDocuments,
} from "./components/documents/documentsStructures";
import {
  convertObjectToArray,
  reverseObjectKeyValues,
} from "@/app/utils/common.util";
import { FileUploadCategory } from "@/types/file-upload.type";
import { StructureState } from "@/types/structure.type";

export default function FinalisationFinanceForm({
  currentStep,
}: {
  currentStep: number;
}) {
  const { years } = useYearRange();
  const { dateStringToYear } = useDateStringToYear();
  const { structure, setStructure } = useStructureContext();
  const hasCpom = structure?.cpom;
  const isAutorisee = isStructureAutorisee(structure?.type);
  const isSubventionnee = isStructureSubventionnee(structure?.type);
  const { updateAndRefreshStructure } = useStructures();
  const router = useRouter();

  const documents = isAutorisee
    ? structureAutoriseesDocuments
    : structureSubventionneesDocuments;

  const { getDocumentIndexes } = useDocumentIndex();
  const documentIndexes = getDocumentIndexes(
    years as unknown as string[],
    documents
  );

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

  const buildFileUploadsDefaultValues = () => {
    const indexWithValues = reverseObjectKeyValues(documentIndexes);
    const documents = convertObjectToArray(indexWithValues);
    const fileUploads = documents.map((document) => {
      const [fileUploadCategory, year] = document.toString().split("-");
      const fileUpload = structure.fileUploads?.find((fileUpload) => {
        const formattedFileUploadCategory =
          FileUploadCategory[
            fileUpload.category as unknown as keyof typeof FileUploadCategory
          ];
        return (
          formattedFileUploadCategory === fileUploadCategory &&
          new Date(fileUpload.date || "").getFullYear() === Number(year)
        );
      });
      return fileUpload ?? null;
    });
    return fileUploads;
  };

  const defaultValues = {
    budgets: budgetArray as unknown as anyFinanceFormValues["budgets"],
    fileUploads: buildFileUploadsDefaultValues(),
  };

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [backendError, setBackendError] = useState<string | undefined>("");

  const getTutorialLink = (): string => {
    if (isAutorisee && hasCpom) {
      return "https://www.loom.com/share/e27a0e312d3c4d0d9aa609970ae5a7f4?sid=4bfe4fbd-32de-4560-b7e2-6ab576cadaaf";
    }
    if (isAutorisee && !hasCpom) {
      return "https://www.loom.com/share/c5f156d305404effb7e6b33b82afb7eb?sid=a4939232-0a86-466a-9c0c-44d32c1b8b80";
    }
    if (isSubventionnee && hasCpom) {
      return "https://www.loom.com/share/afb74bbadc604e48ab64c854f41223aa?sid=8188601d-3ba8-40d7-b6f2-3dca761d831b";
    }
    if (isSubventionnee && !hasCpom) {
      return "https://www.loom.com/share/558e836ecbfe45cc9afaedd6851ca5c4?sid=f00d8670-f7ee-43b8-ae4c-5269ae857ba2";
    }
    return "";
  };

  const handleSubmit = async (data: anyFinanceFormValues) => {
    setState("loading");

    data.budgets.forEach((budget) => {
      if (budget.id === "") {
        delete budget.id;
      }
    });

    const updatedStructure = await updateAndRefreshStructure(
      structure.id,
      {
        ...data,
        dnaCode: structure.dnaCode,
      },
      setStructure
    );
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
      <Notice
        severity="warning"
        title=""
        className="rounded [&_p]:flex [&_p]:items-center mb-8 w-fit [&_.fr-notice\_\_desc]:text-text-default-grey"
        description={
          <>
            La complétion de cette partie étant complexe, veuillez vous référer{" "}
            <Link
              href={getTutorialLink()}
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
