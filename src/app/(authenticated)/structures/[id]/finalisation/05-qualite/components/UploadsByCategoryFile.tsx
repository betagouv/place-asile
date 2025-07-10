import { useFormContext } from "react-hook-form";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import SelectWithValidation from "@/app/components/forms/SelectWithValidation";
import UploadWithValidation from "@/app/components/forms/UploadWithValidation";
import Link from "next/link";
import Button from "@codegouvfr/react-dsfr/Button";
import {
  useFiles,
  FileMetaData,
  UploadsByCategoryFileData,
} from "./FilesContext";
import { ControleType } from "@/types/controle.type";
import { UploadsByCategoryAvenant } from "./UploadsByCategoryAvenant";

export const UploadsByCategoryFile = ({
  file,
  categoryId,
  categoryShortName,
  // fieldBaseName,
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
              name={`${categoryId}.${index}.date`}
              defaultValue={file.date}
              control={control}
              label="Date"
              className="w-full mb-0"
              type="date"
            />

            <SelectWithValidation
              name={`${categoryId}.${index}.type`}
              control={control}
              label="Type"
              className="w-full"
            >
              <option>Sélectionnez une option</option>
              <option value={ControleType.PROGRAMME}>Programmé</option>
              <option value={ControleType.INOPINE}>Inopiné</option>
            </SelectWithValidation>
          </div>
        )}
        {fileMetaData === FileMetaData.DATE_START_END && (
          <div className="flex gap-6 items-center h-full">
            <InputWithValidation
              name={`${categoryId}.${index}.startDate`}
              defaultValue={file.startDate}
              control={control}
              label={`Début ${categoryShortName}`}
              className="w-full mb-0"
              type="date"
            />

            <InputWithValidation
              name={`${categoryId}.${index}.endDate`}
              control={control}
              label={`Fin ${categoryShortName}`}
              className="w-full mb-0"
              type="date"
            />
          </div>
        )}
        {/* {fileMetaData === FileMetaData.NAME && (
          <div className="flex gap-6 items-center h-full">
            <InputWithValidation
              name={`${categoryId}.${index}.name`}
              control={control}
              label="Nom du document"
              className="w-full mb-0"
              type="text"
              hintText="32 caractères maximum"
            />
          </div>
        )} */}
        <div className="flex flex-col">
          <label className="mb-2">{documentLabel}</label>
          <UploadWithValidation
            name={`${categoryId}.${index}.key`}
            control={control}
          />
          <input
            type="hidden"
            {...register(`${categoryId}.${index}.category`)}
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
            // console.log("Rendering avenant:", {
            //   avenant,
            //   avenantIndex,
            //   id: avenant.id,
            // });
            return (
              <UploadsByCategoryAvenant
                key={`${avenant.key || ""}-${avenantIndex}`}
                fieldBaseName={`${categoryId}.${index}.avenants`}
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
