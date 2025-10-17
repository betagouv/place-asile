import Button from "@codegouvfr/react-dsfr/Button";
import { ReactElement, useState } from "react";
import { useFormContext } from "react-hook-form";

import { formatDateString } from "@/app/utils/date.util";
import { EvaluationFormValues } from "@/schemas/base/documents.schema";

import InputWithValidation from "../InputWithValidation";
import UploadWithValidation from "../UploadWithValidation";
import { Notes } from "./Notes";

export const Evaluation = ({
  index,
  field,
  deleteEvaluation,
}: Props): ReactElement => {
  const { watch, control, register } = useFormContext();
  const evaluations = watch("evaluations") || [];
  const currentEvaluation = evaluations[index];
  const [type, setType] = useState<"empty" | "old" | "new">("empty");
  const handleType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const evaluationYear = new Date(event.target.value).getFullYear();
    if (!evaluationYear) {
      setType("empty");
    }
    if (evaluationYear < 2022) {
      setType("old");
    } else {
      setType("new");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-title-blue-france">
        {evaluations[index]?.date
          ? `Evaluation du ${formatDateString(currentEvaluation?.date)}`
          : "Nouvelle évaluation"}
      </h3>
      <div className="flex justify-between items-center">
        <div className="w-full">
          <div className="flex pb-6">
            <InputWithValidation
              name={`evaluations.${index}.date`}
              defaultValue={field.date}
              control={control}
              label="Date"
              className="w-fit mb-0"
              type="date"
              onChange={handleType}
            />
            <input type="hidden" {...register(`evaluations.${index}.id`)} />
            {type !== "empty" && (
              <div className="mx-8 border-r-1 border-default-grey" />
            )}
            {type === "old" && (
              <div className="flex flex-col grow">
                <p className="mb-2">Rapport</p>
                <UploadWithValidation
                  name={`evaluations.${index}.fileUploads.0.key`}
                  control={control}
                />
                <input
                  type="hidden"
                  {...register(`evaluations.${index}.fileUploads.0.category`)}
                  defaultValue="EVALUATION"
                />
              </div>
            )}
            {type === "new" && <Notes index={index} field={field} />}
          </div>
          {type === "new" && (
            <div className="flex">
              <div className="flex flex-col grow pr-8">
                <p className="mb-2">Rapport</p>
                <UploadWithValidation
                  name={`evaluations.${index}.fileUploads.0.key`}
                  control={control}
                />
                <input
                  type="hidden"
                  {...register(`evaluations.${index}.fileUploads.0.category`)}
                  defaultValue="EVALUATION"
                />
              </div>
              <div className="flex flex-col grow">
                <p className="mb-2">Plan d’action (optionnel)</p>
                <UploadWithValidation
                  name={`evaluations.${index}.fileUploads.1.key`}
                  control={control}
                />
                <input
                  type="hidden"
                  {...register(`evaluations.${index}.fileUploads.1.category`)}
                  defaultValue="EVALUATION"
                />
              </div>
            </div>
          )}
        </div>
        {index > 0 && (
          <Button
            iconId="fr-icon-delete-bin-line"
            priority="tertiary no outline"
            className="ml-8"
            title="Supprimer"
            onClick={() => deleteEvaluation(index)}
            type="button"
          />
        )}
      </div>
    </div>
  );
};

type Props = {
  index: number;
  field: EvaluationFormValues;
  deleteEvaluation: (index: number) => void;
};
