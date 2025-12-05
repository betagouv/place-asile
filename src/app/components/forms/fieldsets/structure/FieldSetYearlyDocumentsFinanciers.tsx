import Notice from "@codegouvfr/react-dsfr/Notice";
import { ReactElement, useEffect, useRef } from "react";
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
  const { watch, formState } = useFormContext();
  const isInCpom = watch(`structureMillesimes.${index}.cpom`);

  const yearErrors =
    formState.errors?.documentsFinanciers?.[
      String(year) as keyof typeof formState.errors.documentsFinanciers
    ];
  const hasError = yearErrors && Object.keys(yearErrors).length > 0;

  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  useEffect(() => {
    if (hasError && fieldsetRef.current) {
      fieldsetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [hasError]);

  const shouldHide = startYear && Number(year) < startYear;
  if (shouldHide) {
    return null;
  }
  return (
    <fieldset ref={fieldsetRef}>
      <h2 className="text-title-blue-france text-xl mb-6">{year}</h2>
      {hasError && (
        <p className=" text-default-error flex items-center gap-2">
          <i
            className="fr-icon-error-fill text-default-error"
            aria-hidden="true"
          />
          Veuillez importer les documents financiers requis concernant cette
          année.
        </p>
      )}

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
