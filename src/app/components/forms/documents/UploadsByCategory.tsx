import Button from "@codegouvfr/react-dsfr/Button";
import Notice from "@codegouvfr/react-dsfr/Notice";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { ActeAdministratifFormValues } from "@/schemas/forms/base/acteAdministratif.schema";
import { ControleFormValues } from "@/schemas/forms/base/controles.schema";
import { AdditionalFieldsType } from "@/types/categoryToDisplay.type";
import { zActeAdministratifCategory } from "@/types/file-upload.type";

import { ControleItem } from "./ControleItem";
import { UploadsByCategoryFile } from "./UploadsByCategoryFile";

export type ActeAdministratifField = ActeAdministratifFormValues & {
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
  additionalFieldsType,
  documentLabel,
}: UploadsByCategoryProps) {
  const { control, watch } = useFormContext();
  const { append, remove } = useFieldArray({
    control,
    name: "actesAdministratifs",
  });

  const { append: appendControle, remove: removeControle } = useFieldArray({
    control,
    name: "controles",
  });

  const actesAdministratifs = watch("actesAdministratifs") || [];

  const controles = watch("controles") || [];

  let filteredFields: ActeAdministratifField[] = [];

  const refreshFields = () => {
    filteredFields = actesAdministratifs.filter(
      (field: ActeAdministratifField) => {
        return (
          field.category &&
          (field.category as string) === category &&
          !field.parentFileUploadId
        );
      }
    );
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
    const avenants = actesAdministratifs.filter(
      (field: ActeAdministratifField) =>
        field.parentFileUploadId === actesAdministratifs[index].id
    );

    avenants.map((avenant: ActeAdministratifField) => {
      const index = getItemIndex(avenant.uuid);
      remove(index);
    });

    refreshFields();
  };

  const handleDeleteControle = (index: number) => {
    removeControle(index);
  };

  const getItemIndex = (uuid: string) => {
    const index = actesAdministratifs.findIndex(
      (f: ActeAdministratifField) => f.uuid === uuid
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
      {additionalFieldsType !== AdditionalFieldsType.INSPECTION_CONTROLE &&
        filteredFields &&
        filteredFields.length > 0 &&
        filteredFields.map((field) => {
          const fieldIndex = getItemIndex(field.uuid);

          return (
            <div key={fieldIndex} className="mb-4">
              <UploadsByCategoryFile
                categoryShortName={categoryShortName}
                field={field}
                index={fieldIndex}
                key={field.key || null}
                additionalFieldsType={
                  additionalFieldsType ||
                  AdditionalFieldsType.INSPECTION_CONTROLE
                }
                documentLabel={documentLabel}
                handleDeleteField={handleDeleteField}
                canAddAvenant={canAddAvenant}
              />
            </div>
          );
        })}
      {additionalFieldsType === AdditionalFieldsType.INSPECTION_CONTROLE &&
        controles.map((field: ControleField, index: number) => {
          return (
            <div key={`controle-${field.id || field.uuid || index}`}>
              <ControleItem
                field={field}
                index={index}
                documentLabel={documentLabel}
                handleDeleteField={() => handleDeleteControle(index)}
              />
            </div>
          );
        })}
      {additionalFieldsType !== AdditionalFieldsType.INSPECTION_CONTROLE &&
        canAddFile && (
          <Button
            onClick={handleAddNewField}
            priority="tertiary no outline"
            className="underline font-normal p-0"
          >
            + {addFileButtonLabel}
          </Button>
        )}
      {additionalFieldsType === AdditionalFieldsType.INSPECTION_CONTROLE && (
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
  category: z.infer<typeof zActeAdministratifCategory>;
  categoryShortName: string;
  title: string;
  notice?: string | React.ReactElement;
  isOptional?: boolean;
  canAddFile?: boolean;
  canAddAvenant?: boolean;
  addFileButtonLabel?: string;
  additionalFieldsType?: AdditionalFieldsType;
  documentLabel: string;
};
