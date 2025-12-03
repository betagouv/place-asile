import Notice from "@codegouvfr/react-dsfr/Notice";
import { ReactElement } from "react";
import { Control, useFormContext } from "react-hook-form";

import { DocumentsFinanciersFlexibleFormValues } from "@/schemas/forms/base/documentFinancier.schema";

import { DocumentsFinanciers } from "../../finance/documents/DocumentsFinanciers";
import { DocumentsFinanciersCheckboxIsInCpom } from "../../finance/documents/DocumentsFinanciersCheckboxIsInCpom";
import { DocumentsFinanciersCommentaire } from "../../finance/documents/DocumentsFinanciersCommentaire";
import { YearlyFileUpload } from "../../finance/documents/YearlyFileUpload";

export const FieldSetYearlyDocumentsFinanciers = ({
  index,
  year,
  startYear,
  isAutorisee,
  control,
}: Props): ReactElement | null => {
  const { watch } = useFormContext();
  const isInCpom = watch(`structureMillesimes.${index}.cpom`);

  const shouldHide = startYear && Number(year) < startYear;
  if (shouldHide) {
    return null;
  }
  return (
    <fieldset>
      <h2 className="text-title-blue-france text-xl mb-6">{year}</h2>
      <DocumentsFinanciersCheckboxIsInCpom year={year} index={index} />

      {isInCpom && (
        <Notice
          severity="info"
          title=""
          className="rounded [&_p]:flex [&_p]:items-center mb-10"
          description="Selon vos pratiques, les documents financiers de cette année peuvent être à l’échelle de la structure et/ou du CPOM et/ou regrouper les deux. Veuillez importer tous les documents en votre possession en précisant leur échelle."
        />
      )}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <DocumentsFinanciers
          isAutorisee={isAutorisee}
          control={control}
          year={year}
        />
        <YearlyFileUpload
          year={year}
          index={index}
          isAutorisee={isAutorisee}
          control={control}
        />
      </div>
      <DocumentsFinanciersCommentaire
        year={year}
        index={index}
        control={control}
      />
      <hr className="mt-10 mb-8" />
    </fieldset>
  );
};

type Props = {
  index: number;
  year: number;
  startYear: number;
  isAutorisee: boolean;
  control: Control<DocumentsFinanciersFlexibleFormValues>;
};
