import Notice from "@codegouvfr/react-dsfr/Notice";
import Link from "next/link";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { FileUploadFormValues } from "@/schemas/finalisation/finalisationQualite.schema";
import { zDdetsFileUploadCategory } from "@/types/file-upload.type";

import { FileMetaData } from "../FinalisationQualiteForm";
import { UploadsByCategoryFile } from "./UploadsByCategoryFile";

export type FileUploadField = FileUploadFormValues & {
  id: string;
  uuid: string;
};

export default function UploadsByCategory({
  category,
  categoryShortName,
  title,
  notice,
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
      {notice && (
        <Notice
          severity="info"
          title=""
          className="rounded [&_p]:flex [&_p]:items-center w-fit [&_.fr-notice\_\_desc]:text-text-default-grey"
          description={<>{notice}</>}
        />
      )}
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
  category: z.infer<typeof zDdetsFileUploadCategory>;
  categoryShortName: string;
  title: string;
  notice?: string | React.ReactElement;
  isOptional?: boolean;
  canAddFile?: boolean;
  canAddAvenant?: boolean;
  addFileButtonLabel?: string;
  fileMetaData?: FileMetaData;
  documentLabel: string;
};
