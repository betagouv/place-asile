import { useFormContext } from "react-hook-form";

import { useStructureContext } from "@/app/(authenticated)/structures/[id]/_context/StructureClientContext";
import { MaxSizeNotice } from "@/app/components/forms/MaxSizeNotice";
import { getYearRange } from "@/app/utils/date.util";
import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";
import { DocumentsFinanciersFlexibleFormValues } from "@/schemas/forms/base/documentFinancier.schema";

import { FieldSetYearlyDocumentsFinanciers } from "../../fieldsets/structure/FieldSetYearlyDocumentsFinanciers";

export const Documents = ({ className }: { className?: string }) => {
  const { structure } = useStructureContext();
  const { control } = useFormContext<DocumentsFinanciersFlexibleFormValues>();
  const isSubventionnee = isStructureSubventionnee(structure?.type);
  const isAutorisee = isStructureAutorisee(structure?.type);

  const startYear = structure?.date303
    ? new Date(structure.date303).getFullYear()
    : new Date(structure.creationDate).getFullYear();

  const { years } = getYearRange();

  const yearsToDisplay = isSubventionnee ? years.slice(2) : years;

  const noYear =
    yearsToDisplay.filter((year) => Number(year) >= startYear).length === 0;

  return (
    <div className={className}>
      <MaxSizeNotice />
      {noYear && (
        <p className="text-disabled-grey mb-0 text-sm col-span-3">
          La structure est trop récente et n’est pas en mesure de fournir de
          documents. Vous pouvez valider cette étape.
        </p>
      )}
      {yearsToDisplay.map((year, index) => (
        <FieldSetYearlyDocumentsFinanciers
          key={year}
          year={year}
          startYear={startYear}
          isAutorisee={isAutorisee}
          control={control}
          index={index}
        />
      ))}
    </div>
  );
};
