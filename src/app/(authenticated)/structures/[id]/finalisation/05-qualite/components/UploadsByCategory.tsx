import React from "react";
import { useFormContext } from "react-hook-form";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import SelectWithValidation from "@/app/components/forms/SelectWithValidation";
import UploadWithValidation from "@/app/components/forms/UploadWithValidation";
import Link from "next/link";
import Button from "@codegouvfr/react-dsfr/Button";
import {
  FilesProvider,
  useFiles,
  FileMetaData,
  UploadsByCategoryFileData,
} from "./FilesContext";

export const UploadsByCategory = ({
  categoryId,
  categoryShortName,
  fieldBaseName,
  title,
  addFileButtonLabel,
  fileMetaData,
  isOptional,
  canAddFile,
  canAddAvenant,
  documentLabel = "Document",
  files,
}: UploadsByCategoryProps) => {
  return (
    <FilesProvider initialFiles={files || []}>
      <UploadsByCategoryContent
        categoryId={categoryId}
        categoryShortName={categoryShortName}
        fieldBaseName={fieldBaseName}
        title={title}
        addFileButtonLabel={addFileButtonLabel}
        fileMetaData={fileMetaData}
        isOptional={isOptional}
        canAddFile={canAddFile}
        canAddAvenant={canAddAvenant}
        documentLabel={documentLabel}
      />
    </FilesProvider>
  );
};

const UploadsByCategoryContent = ({
  categoryId,
  categoryShortName,
  fieldBaseName,
  title,
  addFileButtonLabel,
  fileMetaData,
  isOptional,
  canAddFile,
  canAddAvenant,
  documentLabel = "Document",
}: Omit<UploadsByCategoryProps, "files">) => {
  const { files, addFile } = useFiles();

  const handleAddFile = (e: React.MouseEvent) => {
    e.preventDefault();
    addFile();
  };

  return (
    <fieldset className="flex flex-col gap-6 w-full">
      <legend className="text-xl font-bold mb-4 text-title-blue-france">
        {title} {isOptional && "(optionnel)"}
      </legend>
      {files &&
        files.length > 0 &&
        files.map((file, index) => (
          <UploadsByCategoryFile
            key={`file-${index}`}
            file={file}
            categoryId={categoryId}
            categoryShortName={categoryShortName}
            fieldBaseName={fieldBaseName}
            documentLabel={documentLabel}
            canAddAvenant={canAddAvenant || false}
            fileMetaData={fileMetaData || FileMetaData.DATE_TYPE}
            isOptional={isOptional || false}
            index={index}
          />
        ))}
      {canAddFile && (
        <Link
          href={"/"}
          className="text-action-high-blue-france underline underline-offset-4 mt-8"
          onClick={handleAddFile}
        >
          + {addFileButtonLabel}
        </Link>
      )}
    </fieldset>
  );
};

const UploadsByCategoryFile = ({
  file,
  categoryId,
  categoryShortName,
  fieldBaseName,
  documentLabel,
  canAddAvenant,
  fileMetaData,
  index,
}: Omit<UploadsByCategoryFileProps, "files" | "setFilesState">) => {
  const { control, register } = useFormContext();
  const { deleteFile, addAvenant } = useFiles();

  const handleDeleteFile = () => {
    deleteFile(index);
  };

  const handleAddAvenant = (e: React.MouseEvent) => {
    e.preventDefault();
    addAvenant(index);
  };
  return (
    <>
      <div className="grid  grid-cols-[1fr_1fr_auto] gap-6 items-center ">
        {fileMetaData === FileMetaData.DATE_TYPE && (
          <div className="flex gap-6 items-center h-full">
            <InputWithValidation
              name={`${fieldBaseName}.${index}.date`}
              defaultValue={file.date}
              control={control}
              label="Date"
              className="w-full mb-0"
              type="date"
            />

            <SelectWithValidation
              name={`${fieldBaseName}.${index}.type`}
              control={control}
              label="Type"
              className="w-full"
            >
              <option>Sélectionnez une option</option>
              <option value="programme">Programmé</option>
              <option value="inopine">Inopiné</option>
            </SelectWithValidation>
          </div>
        )}
        {fileMetaData === FileMetaData.DATE_START_END && (
          <div className="flex gap-6 items-center h-full">
            <InputWithValidation
              name={`${fieldBaseName}.${index}.startDate`}
              defaultValue={file.startDate}
              control={control}
              label={`Début ${categoryShortName}`}
              className="w-full mb-0"
              type="date"
            />

            <InputWithValidation
              name={`${fieldBaseName}.${index}.endDate`}
              control={control}
              label={`Fin ${categoryShortName}`}
              className="w-full mb-0"
              type="date"
            />
          </div>
        )}
        <div className="flex flex-col">
          <label className="mb-2">{documentLabel}</label>
          <UploadWithValidation
            name={`${fieldBaseName}.${index}.key`}
            control={control}
          />
          <input
            type="hidden"
            {...register(`${fieldBaseName}.${index}.category`)}
            defaultValue={categoryId}
          />
        </div>
        <Button
          iconId="fr-icon-delete-bin-line"
          onClick={handleDeleteFile}
          priority="tertiary no outline"
          className="mt-8"
          title="Supprimer"
        />
      </div>
      {canAddAvenant && (
        <div className="flex flex-col ml-8 pl-8 border-l-2 border-default-grey">
          {file.avenants?.map((avenant, avenantIndex) => {
            console.log("Rendering avenant:", {
              avenant,
              avenantIndex,
              id: avenant.id,
            });
            return (
              <UploadsByCategoryAvenant
                key={`${avenant.key || ""}-${avenantIndex}`}
                fieldBaseName={`${fieldBaseName}.${index}.avenants`}
                documentLabel="Avenant"
                categoryId={categoryId}
                avenantIndex={avenantIndex}
                avenantId={avenant.id || ""}
                parentFileIndex={index}
              />
            );
          })}
          <Link
            href={"/"}
            className="text-action-high-blue-france underline underline-offset-4 mt-4"
            onClick={handleAddAvenant}
          >
            + Ajouter un avenant
          </Link>
        </div>
      )}
    </>
  );
};

const UploadsByCategoryAvenant = ({
  fieldBaseName,
  documentLabel,
  categoryId,
  avenantIndex,
  avenantId,
  parentFileIndex,
}: Omit<UploadsByCategoryAvenantProps, "mainFiles" | "setFilesState">) => {
  const { control, register } = useFormContext();
  const { deleteAvenant } = useFiles();

  const handleDeleteAvenant = () => {
    console.log(
      "Deleting avenant with ID:",
      avenantId,
      "from file index:",
      parentFileIndex
    );
    deleteAvenant(parentFileIndex, avenantId);
  };

  return (
    <div className="flex gap-6 items-center h-full">
      <InputWithValidation
        name={`${fieldBaseName}.${avenantIndex}.date`}
        control={control}
        label="Date avenant"
        className="w-full mb-0"
        type="date"
      />
      <div className="flex flex-col w-full">
        <label className="mb-2">{documentLabel}</label>
        <UploadWithValidation
          name={`${fieldBaseName}.${avenantIndex}.key`}
          control={control}
        />
        <input
          type="hidden"
          {...register(`${fieldBaseName}.${avenantIndex}.category`)}
          defaultValue={categoryId}
        />
      </div>
      <Button
        iconId="fr-icon-delete-bin-line"
        onClick={handleDeleteAvenant}
        priority="tertiary no outline"
        className="mt-8"
        title="Supprimer"
      />
    </div>
  );
};

type UploadsByCategoryProps = {
  categoryId: string;
  categoryShortName: string;
  fieldBaseName: string;
  title: string;
  documentLabel?: string;
  hasAvenants?: boolean;
  fileMetaData?: FileMetaData;
  info?: string;
  isOptional?: boolean;
  canAddFile?: boolean;
  addFileButtonLabel?: string;
  canAddAvenant?: boolean;
  files?: UploadsByCategoryFileData[];
};

type UploadsByCategoryFileProps = {
  file: UploadsByCategoryFileData;
  categoryId: string;
  categoryShortName: string;
  fieldBaseName: string;
  documentLabel?: string;
  canAddAvenant: boolean;
  fileMetaData: FileMetaData;
  isOptional: boolean;
  index: number;
};

type UploadsByCategoryAvenantProps = {
  fieldBaseName: string;
  documentLabel: string;
  categoryId: string;
  avenantIndex: number;
  avenantId: string;
  parentFileIndex: number;
};

// Types are now imported from FilesContext
