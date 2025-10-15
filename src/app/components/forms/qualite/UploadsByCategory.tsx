import Button from "@codegouvfr/react-dsfr/Button";
import Notice from "@codegouvfr/react-dsfr/Notice";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import {
  ControleFormValues,
  FileUploadFormValues,
} from "@/schemas/base/documents.schema";
import { FileMetaData } from "@/types/file-upload.type";
import { zAgentFileUploadCategory } from "@/types/file-upload.type";

import { ControleItem } from "./ControleItem";
import { UploadsByCategoryFile } from "./UploadsByCategoryFile";

export type FileUploadField = FileUploadFormValues & {
  id: string;
  uuid: string;
};

export type ControleField = ControleFormValues & {
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

  const { append: appendControle, remove: removeControle } = useFieldArray({
    control,
    name: "controles",
  });

  const fileUploads = watch("fileUploads") || [];

  const controles = watch("controles") || [];

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

  const handleAddNewControle = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    const newField = {
      date: "",
      type: "",
      uuid: uuidv4(),
    };

    appendControle(newField);

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

  const handleDeleteControle = (index: number) => {
    removeControle(index);
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
      {fileMetaData !== FileMetaData.INSPECTION_CONTROLE &&
        filteredFields &&
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
                fileMetaData={fileMetaData || FileMetaData.INSPECTION_CONTROLE}
                documentLabel={documentLabel}
                handleDeleteField={handleDeleteField}
                canAddAvenant={canAddAvenant}
              />
            </div>
          );
        })}
      {fileMetaData === FileMetaData.INSPECTION_CONTROLE &&
        controles.map((field: ControleField, index: number) => {
          return (
            <div key={`controle-${index}`}>
              <ControleItem
                field={field}
                index={index}
                documentLabel={documentLabel}
                handleDeleteField={() => handleDeleteControle(index)}
              />
            </div>
          );
        })}
      {fileMetaData !== FileMetaData.INSPECTION_CONTROLE && canAddFile && (
        <Button
          onClick={handleAddNewField}
          priority="tertiary no outline"
          className="underline font-normal p-0"
        >
          + {addFileButtonLabel}
        </Button>
      )}
      {fileMetaData === FileMetaData.INSPECTION_CONTROLE && (
        <Button
          onClick={handleAddNewControle}
          priority="tertiary no outline"
          className="underline font-normal p-0"
        >
          + {addFileButtonLabel}
        </Button>
      )}
    </fieldset>
  );
}

type UploadsByCategoryProps = {
  category: z.infer<typeof zAgentFileUploadCategory>;
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
