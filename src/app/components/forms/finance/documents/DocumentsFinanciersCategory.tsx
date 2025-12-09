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
  const isAllowedYear =
    year <= new Date().getFullYear() - documentType.yearIndex;

  return (
    <Accordion
      key={documentType.label}
      label={
        <div className="flex items-center gap-2 justify-between w-full">
          <div>
            <div>
              <strong>{documentType.label}</strong>
              {!(documentType.required && isAllowedYear) && (
                <span className="text-default-grey italic"> - optionnel</span>
              )}
            </div>
            <span className="text-sm ">{documentType.subLabel}</span>
          </div>
          {((documentType.required && isAllowedYear) || isFilled) && (
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
