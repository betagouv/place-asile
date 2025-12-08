import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { Controller } from "react-hook-form";

import { useFormContext } from "@/app/context/FormContext";
import { StructureMillesimeApiType } from "@/schemas/api/structure-millesime.schema";

export const DocumentsFinanciersCheckboxIsInCpom = ({ year, index }: Props) => {
  const { control, watch } = useFormContext();

  const structureMillesimes = watch(
    "structureMillesimes"
  ) as StructureMillesimeApiType[];

  const getChecked = () => {
    return !!structureMillesimes.find((structureMillesime) => {
      return (
        new Date(structureMillesime.date).getFullYear() === year &&
        structureMillesime.cpom
      );
    });
  };
  console.log(">>>>>>>>>>>><", structureMillesimes, getChecked());

  // getIndex(year) => index
  // 2023 => 0
  // 2022 => 1
  // 2021 => 2

  return (
    <Controller
      control={control}
      name={`structureMillesimes.${index}.cpom`}
      render={({ field }) => (
        <Checkbox
          className="mb-6"
          options={[
            {
              label: `En ${year}, cette structure faisait partie d’un CPOM et était prise en compte dans les résultats financiers de celui-ci`,
              nativeInputProps: {
                name: field.name,
                checked: getChecked(),
                onChange: field.onChange,
              },
            },
          ]}
        />
      )}
    />
  );
  // return (
  //   <Checkbox
  //     options={[
  //       {
  //         label: `En ${year}, cette structure faisait partie d’un CPOM et était prise en compte dans les résultats financiers de celui-ci`,
  //         nativeInputProps: {
  //           ...register(`structureMillesimes.${index}.cpom`),
  //         },
  //       },
  //     ]}
  //     className="mb-6"
  //   />
  // );
};

type Props = {
  year: number;
  index: number;
};
