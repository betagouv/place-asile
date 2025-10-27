import { ReactElement } from "react";
import { useFormContext } from "react-hook-form";

import { EvaluationFormValues } from "@/schemas/base/evaluation.schema";

import InputWithValidation from "../InputWithValidation";

export const Notes = ({ index, field }: Props): ReactElement => {
  const { control } = useFormContext();

  return (
    <div className="flex pb-6">
      <div>
        <h4 className="font-normal mb-0 text-base">Notes</h4>
        <div className="flex">
          <div className="flex pr-6 items-end">
            <InputWithValidation
              name={`evaluations.${index}.notePersonne`}
              min={0}
              max={4}
              defaultValue={field.date}
              control={control}
              label="La personne"
              className="w-full mb-0 [&>label]:italic [&>label]:text-sm"
              type="number"
            />
            <span className="pl-2 pb-2">/4</span>
          </div>
          <div className="flex pr-6 items-end">
            <InputWithValidation
              name={`evaluations.${index}.notePro`}
              min={0}
              max={4}
              defaultValue={field.date}
              control={control}
              label="Les professionnels"
              className="w-full mb-0 [&>label]:italic [&>label]:text-sm"
              type="number"
            />
            <span className="pl-2 pb-2">/4</span>
          </div>
          <div className="flex pr-6 items-end">
            <InputWithValidation
              name={`evaluations.${index}.noteStructure`}
              min={0}
              max={4}
              defaultValue={field.date}
              control={control}
              label="La structure"
              className="w-full mb-0 [&>label]:italic [&>label]:text-sm"
              type="number"
            />
            <span className="pl-2 pb-2">/4</span>
          </div>
          <div className="flex items-end">
            <InputWithValidation
              name={`evaluations.${index}.note`}
              min={0}
              max={4}
              defaultValue={field.date}
              control={control}
              label="Moyenne"
              className="w-full mb-0 [&>label]:italic [&>label]:text-sm"
              type="number"
            />
            <span className="pl-2 pb-2">/4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

type Props = {
  index: number;
  field: EvaluationFormValues;
};
