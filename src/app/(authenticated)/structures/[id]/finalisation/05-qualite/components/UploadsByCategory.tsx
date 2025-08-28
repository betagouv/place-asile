import { useFormContext, useFieldArray } from "react-hook-form";
import { fileUploadSchema } from "../validation/FinalisationQualiteSchema";
import { z } from "zod";
import Link from "next/link";
import { FileMetaData } from "../FinalisationQualiteForm";
import { v4 as uuidv4 } from "uuid";
import { UploadsByCategoryFile } from "./UploadsByCategoryFile";
import { DdetsFileUploadCategoryType } from "@/types/file-upload.type";

export type FileUploadField = z.infer<typeof fileUploadSchema> & {
  id: string;
  uuid: string;
};

export default function UploadsByCategory({
  category,
  categoryShortName,
  title,
  subTitle,
  isOptional,
  canAddFile,
  canAddAvenant = false,
  addFileButtonLabel,
  fileMetaData,
  documentLabel,
}: UploadsByCategoryProps) {
  const { control, watch } = useFormContext();
  const { append, remove } = useFieldArray({
    control,
    name: "fileUploads",
  });

  const fileUploads = watch("fileUploads") || [];
  console.log(category);
  let filteredFields: FileUploadField[] = [];

  const refreshFields = () => {
    filteredFields = fileUploads.filter((field: FileUploadField) => {
      return (
        field.category &&
        (field.category as string) === category &&
        !field.parentFileUploadId
      );
    });
  };

  refreshFields();

  const handleAddNewField = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    const newField = {
      key: null,
      category: category,
      uuid: uuidv4(),
    };

    append(newField);

    refreshFields();
  };

  const handleDeleteField = (index: number) => {
    remove(index);
    const avenants = fileUploads.filter(
      (field: FileUploadField) =>
        field.parentFileUploadId === fileUploads[index].id
    );

    avenants.map((avenant: FileUploadField) => {
      const index = getItemIndex(avenant.uuid);
      remove(index);
    });

    refreshFields();
  };

  const getItemIndex = (uuid: string) => {
    const index = fileUploads.findIndex(
      (f: FileUploadField) => f.uuid === uuid
    );
    return index;
  };

  return (
    <fieldset className="flex flex-col gap-6 w-full">
      <legend className="text-xl font-bold mb-4 text-title-blue-france">
        {title} {isOptional && "(optionnel)"}
      </legend>
      {subTitle}
      {filteredFields &&
        filteredFields.length > 0 &&
        filteredFields.map((field) => {
          const fieldIndex = getItemIndex(field.uuid);

          return (
            <div key={fieldIndex}>
              <UploadsByCategoryFile
                categoryShortName={categoryShortName}
                field={field}
                index={fieldIndex}
                key={field.key || null}
                fileMetaData={fileMetaData || FileMetaData.DATE_TYPE}
                documentLabel={documentLabel}
                handleDeleteField={handleDeleteField}
                canAddAvenant={canAddAvenant}
              />
            </div>
          );
        })}
      {canAddFile && (
        <Link
          href={"/"}
          className="text-action-high-blue-france underline underline-offset-4 mt-8"
          onClick={handleAddNewField}
        >
          + {addFileButtonLabel}
        </Link>
      )}
    </fieldset>
  );
}

type UploadsByCategoryProps = {
  category: DdetsFileUploadCategoryType;
  categoryShortName: string;
  title: string;
  subTitle?: string;
  isOptional?: boolean;
  canAddFile?: boolean;
  canAddAvenant?: boolean;
  addFileButtonLabel?: string;
  fileMetaData?: FileMetaData;
  documentLabel: string;
};
