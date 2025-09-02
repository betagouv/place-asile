import { ReactElement } from "react";
import { UploadItem } from "../../components/UploadItem";
import UploadWithValidation from "@/app/components/forms/UploadWithValidation";
import { getYearDate } from "@/app/utils/date.util";
import { Control, UseFormRegister } from "react-hook-form";
import { DocumentsSchemaFlexible } from "../../validation/documentsSchema";
import { zFileUploadCategory } from "@/types/file-upload.type";
import z from "zod";

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
        name={`fileUploads.${index}.key`}
        id={`fileUploads.${index}.key`}
        control={control}
      />
      <input
        type="hidden"
        aria-hidden="true"
        defaultValue={categoryValue}
        {...register(`fileUploads.${index}.category`)}
      />
      <input
        type="hidden"
        aria-hidden="true"
        defaultValue={getYearDate(year)}
        {...register(`fileUploads.${index}.date`)}
      />
    </UploadItem>
  );
};

type Props = {
  year: string;
  control: Control<DocumentsSchemaFlexible>;
  index: number;
  register: UseFormRegister<DocumentsSchemaFlexible>;
  categoryLabel: string;
  categorySubLabel?: string;
  categoryValue: z.infer<typeof zFileUploadCategory>;
};
