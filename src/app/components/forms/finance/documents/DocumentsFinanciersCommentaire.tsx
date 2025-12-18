import { Control, useFormContext } from "react-hook-form";

import { DocumentsFinanciersFlexibleFormValues } from "@/schemas/forms/base/documentFinancier.schema";

import InputWithValidation from "../../InputWithValidation";

export const DocumentsFinanciersCommentaire = ({
  year,
  index,
  control,
}: Props) => {
  const { register } = useFormContext();
  return (
    <div>
      <InputWithValidation
        id={`structureMillesimes.${index}.year`}
        name={`structureMillesimes.${index}.year`}
        defaultValue={year}
        control={control}
        type="hidden"
        label=""
      />
      <label
        htmlFor={`structureMillesimes.${index}.operateurComment`}
        className="text-title-blue-france font-bold"
      >
        Commentaire
      </label>
      <p className="text-sm text-default-grey">400 caractères maximum</p>
      <textarea
        id={`structureMillesimes.${index}.operateurComment`}
        {...register(`structureMillesimes.${index}.operateurComment`)}
        rows={8}
        className="fr-input"
      />
    </div>
  );
};

type Props = {
  year: number;
  index: number;
  control: Control<DocumentsFinanciersFlexibleFormValues>;
};
