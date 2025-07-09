import { useFormContext } from "react-hook-form";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import UploadWithValidation from "@/app/components/forms/UploadWithValidation";
import Button from "@codegouvfr/react-dsfr/Button";
import { useFiles } from "./FilesContext";

export const UploadsByCategoryAvenant = ({
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

type UploadsByCategoryAvenantProps = {
  fieldBaseName: string;
  documentLabel: string;
  categoryId: string;
  avenantIndex: number;
  avenantId: string;
  parentFileIndex: number;
};
