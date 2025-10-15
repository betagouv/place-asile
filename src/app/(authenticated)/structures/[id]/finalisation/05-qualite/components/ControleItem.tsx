import Button from "@codegouvfr/react-dsfr/Button";
import { useFormContext } from "react-hook-form";

import InputWithValidation from "@/app/components/forms/InputWithValidation";
import SelectWithValidation from "@/app/components/forms/SelectWithValidation";
import UploadWithValidation from "@/app/components/forms/UploadWithValidation";
import { ControleType } from "@/types/controle.type";

import { ControleField } from "./UploadsByCategory";

export const ControleItem = ({
  field,
  index,
  documentLabel,
  handleDeleteField,
}: UploadsByCategoryFileProps) => {
  const { control, register } = useFormContext();

  register(`fileUploads.${index}.id`);
  register(`fileUploads.${index}.parentFileUploadId`);

  return (
    <div className="grid grid-cols-[1fr_1fr_auto] gap-6 items-center ">
      <div className="flex gap-6 items-center h-full">
        <InputWithValidation
          name={`controles.${index}.date`}
          defaultValue={field.date}
          control={control}
          label="Date"
          className="w-full mb-0"
          type="date"
        />

        <SelectWithValidation
          name={`controles.${index}.type`}
          control={control}
          label="Type"
          className="w-full"
        >
          <option>Sélectionnez une option</option>
          <option value={ControleType.PROGRAMME}>Programmé</option>
          <option value={ControleType.INOPINE}>Inopiné</option>
        </SelectWithValidation>
        <input type="hidden" {...register(`controles.${index}.id`)} />
      </div>

      <div className="flex flex-col">
        <label className="mb-2">{documentLabel}</label>
        <UploadWithValidation
          name={`controles.${index}.fileUploads.0.key`}
          control={control}
        />
        <input
          type="hidden"
          {...register(`controles.${index}.fileUploads.0.category`)}
          defaultValue="INSPECTION_CONTROLE"
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
  );
};

type UploadsByCategoryFileProps = {
  field: ControleField;
  index: number;
  documentLabel: string;
  handleDeleteField: (index: number) => void;
};
