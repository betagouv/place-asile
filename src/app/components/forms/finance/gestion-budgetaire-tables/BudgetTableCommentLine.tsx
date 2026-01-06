import { useFormContext } from "react-hook-form";

import { getYearRange } from "@/app/utils/date.util";
import { getBudgetIndexForAYear } from "@/app/utils/structure.util";
import { BudgetApiType } from "@/schemas/api/budget.schema";

import InputWithValidation from "../../InputWithValidation";

export const BudgetTableCommentLine = ({ name, label, budgets }: Props) => {
  const parentFormContext = useFormContext();

  const { control } = parentFormContext;

  const { years } = getYearRange({ order: "desc" });

  return (
    <tr>
      <td>{label}</td>
      {years.map((year) => (
        <td key={year}>
          <div className="flex items-center gap-2">
            <InputWithValidation
              name={`${name}.${getBudgetIndexForAYear(budgets, year)}.${name}`}
              id={`gestionBudgetaire.${getBudgetIndexForAYear(budgets, year)}.${name}`}
              control={control}
              type="number"
              min={0}
              label=""
              className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
              variant="simple"
            />
            &nbsp;€
          </div>
        </td>
      ))}
    </tr>
  );
};

interface Props {
  name: string;
  label: string;
  subLabel?: string;
  budgets: BudgetApiType[];
}
