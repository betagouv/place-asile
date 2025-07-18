import { useFormContext } from "react-hook-form";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import UploadWithValidation from "@/app/components/forms/UploadWithValidation";
import Button from "@codegouvfr/react-dsfr/Button";
import { useFiles } from "./FilesContext";

export const UploadsByCategoryAvenant = ({
  // fieldBaseName,
  documentLabel,
  categoryId,
  avenantIndex,
  avenantId,
  parentFileIndex,
}: Omit<UploadsByCategoryAvenantProps, "mainFiles" | "setFilesState">) => {
  const { control, register } = useFormContext();
  const { deleteAvenant } = useFiles();

  const handleDeleteAvenant = () => {
    deleteAvenant(parentFileIndex, avenantId);
  };

  return (
    <div className="flex gap-6 items-center h-full">
      <InputWithValidation
        name={`${categoryId}.avenants.${avenantIndex}.date`}
        control={control}
        label="Date avenant"
        className="w-full mb-0"
        type="date"
      />
      <div className="flex flex-col w-full">
        <label className="mb-2">{documentLabel}</label>
        <UploadWithValidation
          name={`${categoryId}.avenants.${avenantIndex}.key`}
          control={control}
        />
        <input
          type="hidden"
          {...register(`${categoryId}.avenants.${avenantIndex}.category`)}
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
