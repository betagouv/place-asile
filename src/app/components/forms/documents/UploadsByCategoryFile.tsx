import Button from "@codegouvfr/react-dsfr/Button";
import Link from "next/link";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import InputWithValidation from "@/app/components/forms/InputWithValidation";
import UploadWithValidation from "@/app/components/forms/UploadWithValidation";
import { AdditionalFieldsType } from "@/types/categoryToDisplay.type";

import { FileUploadField } from "./UploadsByCategory";

export const UploadsByCategoryFile = ({
  field,
  index,
  additionalFieldsType,
  documentLabel,
  handleDeleteField,
  canAddAvenant = false,
  categoryShortName,
}: UploadsByCategoryFileProps) => {
  const { control, register, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fileUploads",
  });

  register(`fileUploads.${index}.id`);
  register(`fileUploads.${index}.parentFileUploadId`);

  const watchFieldName = `fileUploads.${index}.id`;
  const mainFileId = watch(watchFieldName);

  let avenants = fields.filter(
    (field) =>
      (field as unknown as FileUploadField).parentFileUploadId === mainFileId
  );

  const getAvenantIndex = (uuid: string) => {
    const index = fields.findIndex(
      (f) => (f as unknown as FileUploadField).uuid === uuid
    );
    return index;
  };

  const handleDeleteAvenant = (index: number) => {
    remove(index);
    avenants = fields.filter(
      (field) =>
        (field as unknown as FileUploadField).parentFileUploadId === mainFileId
    );
  };

  const handleAddNewAvenant = (
    e: React.MouseEvent,
    parentFileUploadId?: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const newField = {
      key: null,
      category: field.category,
      uuid: uuidv4(),
      parentFileUploadId: parentFileUploadId || undefined,
    };

    append(newField);
  };

  return (
    <>
      <div className="grid grid-cols-[1fr_1fr_auto] gap-6 items-start">
        {additionalFieldsType === AdditionalFieldsType.DATE_START_END && (
          <div className="flex gap-6 items-start h-full">
            <InputWithValidation
              name={`fileUploads.${index}.startDate`}
              defaultValue={field.startDate}
              control={control}
              label={`Début ${categoryShortName}`}
              className="w-full mb-0"
              type="date"
            />

            <InputWithValidation
              name={`fileUploads.${index}.endDate`}
              control={control}
              label={`Fin ${categoryShortName}`}
              className="w-full mb-0"
              type="date"
            />
          </div>
        )}
        {additionalFieldsType === AdditionalFieldsType.NAME && (
          <div className="flex gap-6 items-start h-full">
            <InputWithValidation
              name={`fileUploads.${index}.categoryName`}
              control={control}
              label="Nom du document"
              className="w-full mb-0"
              type="text"
              hintText="32 caractères maximum"
            />
          </div>
        )}

        <div className="flex flex-col">
          <label className="mb-2">{documentLabel}</label>
          <UploadWithValidation
            name={`fileUploads.${index}.key`}
            control={control}
          />
          <input
            type="hidden"
            {...register(`fileUploads.${index}.category`)}
            defaultValue={field.category}
          />
        </div>
        {index > 0 && (
          <Button
            iconId="fr-icon-delete-bin-line"
            priority="tertiary no outline"
            className="mt-8"
            title="Supprimer"
            onClick={() => handleDeleteField(index)}
            type="button"
          />
        )}
      </div>
      {canAddAvenant && (
        <div className="flex flex-col mt-4 ml-8 pl-8 border-l-2 border-default-grey">
          {avenants?.map((avenant) => {
            const typedAvenant = avenant as unknown as FileUploadField;
            const avenantIndex = getAvenantIndex(typedAvenant.uuid);
            return (
              <span key={`${typedAvenant.uuid}`}>
                <div className="flex gap-6 items-start h-full">
                  <InputWithValidation
                    name={`fileUploads.${avenantIndex}.date`}
                    control={control}
                    label="Date avenant"
                    className="w-full mb-0"
                    type="date"
                  />
                  <div className="flex flex-col w-full">
                    <label className="mb-2">{documentLabel}</label>
                    <UploadWithValidation
                      name={`fileUploads.${avenantIndex}.key`}
                      control={control}
                    />
                    <input
                      type="hidden"
                      {...register(`fileUploads.${avenantIndex}.category`)}
                      defaultValue={typedAvenant.category}
                    />
                  </div>
                  <Button
                    iconId="fr-icon-delete-bin-line"
                    onClick={() => handleDeleteAvenant(avenantIndex)}
                    type="button"
                    priority="tertiary no outline"
                    className="mt-8"
                    title="Supprimer"
                  />
                </div>
              </span>
            );
          })}
          {canAddAvenant && mainFileId && (
            <Link
              href={"/"}
              className="text-action-high-blue-france underline underline-offset-4 mt-4"
              onClick={(e) => handleAddNewAvenant(e, mainFileId)}
            >
              + Ajouter un avenant
            </Link>
          )}
        </div>
      )}
    </>
  );
};

type UploadsByCategoryFileProps = {
  field: FileUploadField;
  index: number;
  additionalFieldsType: AdditionalFieldsType;
  documentLabel: string;
  categoryShortName: string;
  handleDeleteField: (index: number) => void;
  canAddAvenant: boolean;
};
