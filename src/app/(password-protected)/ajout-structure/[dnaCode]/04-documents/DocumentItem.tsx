import { ReactElement } from "react";
import { Control, UseFormRegister } from "react-hook-form";
import z from "zod";

import UploadWithValidation from "@/app/components/forms/UploadWithValidation";
import { getYearDate } from "@/app/utils/date.util";
import { DocumentsFinanciersFlexibleFormValues } from "@/schemas/forms/base/documentFinancier.schema";
import { zFileUploadCategory } from "@/types/file-upload.type";

import { UploadItem } from "../../components/UploadItem";

export const DocumentItem = ({
  year,
  control,
  index,
  register,
  categoryLabel,
  categorySubLabel,
  categoryValue,
}: Props): ReactElement => {
  return (
    <UploadItem
      title={`${categoryLabel} pour ${year}`}
      subTitle={categorySubLabel}
    >
      <UploadWithValidation
        name={`documentsFinanciers.${index}.key`}
        id={`documentsFinanciers.${index}.key`}
        control={control}
      />
      <input
        type="hidden"
        aria-hidden="true"
        defaultValue={categoryValue}
        {...register(`documentsFinanciers.${index}.category`)}
      />
      <input
        type="hidden"
        aria-hidden="true"
        defaultValue={getYearDate(year)}
        {...register(`documentsFinanciers.${index}.date`)}
      />
    </UploadItem>
  );
};

type Props = {
  year: string;
  control: Control<DocumentsFinanciersFlexibleFormValues>;
  index: number;
  register: UseFormRegister<DocumentsFinanciersFlexibleFormValues>;
  categoryLabel: string;
  categorySubLabel?: string;
  categoryValue: z.infer<typeof zFileUploadCategory>;
};
