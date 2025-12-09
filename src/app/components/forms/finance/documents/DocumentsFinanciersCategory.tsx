import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { ReactElement } from "react";
import { Control, useFormContext } from "react-hook-form";

import { cn } from "@/app/utils/classname.util";
import {
  DocumentFinancierFlexibleFormValues,
  DocumentsFinanciersFlexibleFormValues,
} from "@/schemas/forms/base/documentFinancier.schema";

import { DocumentsFinanciersItem } from "./DocumentsFinanciersItem";
import { StructureDocument } from "./documentsStructures";

export const DocumentsFinanciersCategory = ({
  documentType,
  control,
  year,
}: Props): ReactElement => {
  const { watch } = useFormContext();

  const documentsFinanciers: DocumentFinancierFlexibleFormValues[] = watch(
    "documentsFinanciers"
  );

  const documentsFinanciersOfCategory =
    documentsFinanciers?.filter(
      (documentFinancier) =>
        documentFinancier.category === documentType.value &&
        new Date(documentFinancier.date!).getFullYear() === year
    ) || [];

  const isFilled = documentsFinanciersOfCategory.length > 0;

  return (
    <Accordion
      key={documentType.label}
      label={
        <div className="flex items-center gap-2 justify-between w-full">
          <div className={!isFilled ? "text-disabled-grey" : ""}>
            <div>
              <strong>{documentType.label}</strong>
              {!documentType.required && (
                <span
                  className={cn(
                    isFilled ? "text-default-grey" : "text-disabled-grey",
                    "italic"
                  )}
                >
                  {" "}
                  - optionnel
                </span>
              )}
            </div>
            <span className="text-sm ">{documentType.subLabel}</span>
          </div>
          {(documentType.required || isFilled) && (
            <div
              className={cn(
                "uppercase text-[0.625rem]",
                isFilled ? "text-default-success" : "text-default-warning"
              )}
            >
              {isFilled ? "Importé" : "À importer"}
            </div>
          )}
        </div>
      }
      className={
        !isFilled
          ? "[&>h3>button]:cursor-default [&>h3>button]:hover:bg-transparent [&>h3>button]:after:content-none "
          : ""
      }
    >
      <div>
        {documentsFinanciersOfCategory.map((documentFinancier) => (
          <DocumentsFinanciersItem
            key={documentFinancier.key}
            documentFinancier={documentFinancier}
            control={control}
          />
        ))}
      </div>
    </Accordion>
  );
};

type Props = {
  documentType: StructureDocument;
  control: Control<DocumentsFinanciersFlexibleFormValues>;
  year: number;
};
