import { ReactElement } from "react";
import { Control } from "react-hook-form";

import { cn } from "@/app/utils/classname.util";
import { DocumentsFinanciersFlexibleFormValues } from "@/schemas/forms/base/documentFinancier.schema";

import { DocumentsFinanciers } from "../../finance/documents/DocumentsFinanciers";
import { YearlyFileUpload } from "../../finance/documents/YearlyFileUpload";

export const FieldSetYearlyDocumentsFinanciers = ({
  year,
  startYear,
  isAutorisee,
  control,
}: Props): ReactElement => {
  return (
    <fieldset
      className={cn(
        "flex flex-col gap-4 border-default-grey border-b pb-8 mb-6",
        startYear && Number(year) < startYear && "hidden"
      )}
    >
      <h2 className="text-title-blue-france text-xl mb-0">{year}</h2>
      <div className="grid grid-cols-2 gap-4">
        <DocumentsFinanciers
          isAutorisee={isAutorisee}
          control={control}
          year={year}
        />
        <YearlyFileUpload
          year={year}
          isAutorisee={isAutorisee}
          control={control}
        />
      </div>
    </fieldset>
  );
};

type Props = {
  year: number;
  startYear: number;
  isAutorisee: boolean;
  control: Control<DocumentsFinanciersFlexibleFormValues>;
};
