import InputWithValidation from "@/app/components/forms/InputWithValidation";
import { useYearRange } from "@/app/hooks/useYearRange";
import { useFormContext, useForm } from "react-hook-form";
import { Table } from "@/app/components/common/Table";

export const DetailAffectationTable = () => {
  const { years } = useYearRange();
  const lastTwoYears = years.slice(-2);

  const parentFormContext = useFormContext();

  const localForm = useForm();
  const { control, formState, watch } = parentFormContext || localForm;
  const errors = formState.errors;
  const hasErrors =
    Array.isArray(errors.budget) &&
    errors.budget.some(
      (budgetItemErrors: Record<string, unknown>) =>
        budgetItemErrors?.ETP ||
        budgetItemErrors?.tauxEncadrement ||
        budgetItemErrors?.coutJournalier
    );

  const nextToLastFondsDedies = watch("budget.1.fondsDedies");
  const lastFondsDedies = watch("budget.2.fondsDedies");

  console.log(lastFondsDedies, nextToLastFondsDedies);

  return (
    <Table
      ariaLabelledBy=""
      hasErrors={hasErrors}
      headings={[
        "Année",
        "Total",
        <th scope="col" key="reserveInvestissement">
          réserve dédiée à <br /> l’investissement <br />
          <small className="font-normal">(10682)</small>
        </th>,
        <th scope="col" key="chargesNonReconductibles">
          charges non <br /> reconductibles <br />
          <small className="font-normal">(11511 ou 111)</small>
        </th>,
        <th scope="col" key="reserveCompensationDeficits">
          réserve de <br />
          compensation des <br />
          déficits <small className="font-normal">(10686)</small>
        </th>,
        <th scope="col" key="reserveCouvertureBFR">
          RÉSERVE DE <br />
          COUVERTURE <br />
          DE BFR <small className="font-normal">(10685)</small>
        </th>,
        <th scope="col" key="reserveCompensationAmortis">
          RÉSERVE DE <br />
          COMPENSATION DES <br />
          AMORTIS. <small className="font-normal">(10687)</small>
        </th>,
        <th scope="col" key="fondsDedies">
          fonds
          <br />
          dédiés{" "}
        </th>,
        "commentaires",
      ]}
      enableBorders
    >
      {lastTwoYears.map((year, index) => (
        <tr key={year}>
          <td>{year}</td>
          <td className="whitespace-nowrap">0 €</td>
          <td className="flex items-center gap-2 w-34">
            <InputWithValidation
              name={`budget.${index}.unknown`}
              id={`gestionBudgetaire.${index}.unknown`}
              control={control}
              type="number"
              min={0}
              label=""
              className="mb-0 mx-auto items-center [&_p]:hidden  [&_input]:w-full"
              variant="simple"
            />{" "}
            €
          </td>
          <td>
            <InputWithValidation
              name={`budget.${index}.totalProduits`}
              id={`gestionBudgetaire.${index}.totalProduits`}
              control={control}
              type="number"
              min={0}
              label=""
              className="mb-0 mx-auto items-center [&_p]:hidden  [&_input]:w-full"
              variant="simple"
              disabled={[0, 1].includes(index)}
            />
          </td>
          <td className="!border-r-3">
            <InputWithValidation
              name={`budget.${index}.totalCharges`}
              id={`gestionBudgetaire.${index}.totalCharges`}
              control={control}
              type="number"
              min={0}
              label=""
              className="mb-0 mx-auto items-center [&_p]:hidden  [&_input]:w-full"
              variant="simple"
              disabled={[0, 1, 2].includes(index)}
            />
          </td>
          <td>
            <InputWithValidation
              name={`budget.${index}.cumulResultatsNetsCPOM`}
              id={`gestionBudgetaire.${index}.cumulResultatsNetsCPOM`}
              control={control}
              type="number"
              min={0}
              label=""
              className="mb-0 mx-auto items-center [&_p]:hidden  [&_input]:w-full"
              variant="simple"
              disabled={[0, 1, 2].includes(index)}
            />
          </td>
          <td>
            <InputWithValidation
              name={`budget.${index}.repriseEtat`}
              id={`gestionBudgetaire.${index}.repriseEtat`}
              control={control}
              type="number"
              min={0}
              label=""
              className="mb-0 mx-auto items-center [&_p]:hidden  [&_input]:w-full"
              variant="simple"
              disabled={[0, 1, 2].includes(index)}
            />
          </td>
          <td>
            <InputWithValidation
              name={`budget.${index}.fondsDedies`}
              id={`gestionBudgetaire.${index}.fondsDedies`}
              control={control}
              type="number"
              min={0}
              label=""
              className="mb-0 mx-auto items-center [&_p]:hidden  [&_input]:w-full"
              variant="simple"
              disabled={[0, 1, 2].includes(index)}
            />
          </td>
        </tr>
      ))}
    </Table>
  );
};
