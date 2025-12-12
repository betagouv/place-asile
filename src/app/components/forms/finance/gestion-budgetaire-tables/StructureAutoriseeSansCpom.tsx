import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import { useForm, useFormContext } from "react-hook-form";

import { Table } from "@/app/components/common/Table";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import { getYearRange } from "@/app/utils/date.util";

export const StructureAutoriseeSansCpom = () => {
  const parentFormContext = useFormContext();

  const localForm = useForm();
  const { control, formState, register } = parentFormContext || localForm;
  const errors = formState.errors;
  const { years } = getYearRange();
  const hasErrors =
    Array.isArray(errors.budgets) &&
    errors.budgets.some(
      (budgetItemErrors: Record<string, unknown>) =>
        budgetItemErrors?.dotationDemandee ||
        budgetItemErrors?.dotationAccordee ||
        budgetItemErrors?.totalProduits ||
        budgetItemErrors?.totalCharges ||
        budgetItemErrors?.totalChargesProposees ||
        budgetItemErrors?.repriseEtat ||
        budgetItemErrors?.affectationReservesFondsDedies ||
        budgetItemErrors?.commentaire
    );

  return (
    <Table
      ariaLabelledBy="gestionBudgetaire"
      hasErrors={hasErrors}
      preHeadings={[
        <th scope="col" key="annee" className="!border-r-1">
          {" "}
        </th>,
        <th
          scope="col"
          colSpan={2}
          key="budgetExecutoire"
          className="!border-r-3"
        >
          Budget de la structure
        </th>,
        <th scope="col" colSpan={5} key="compteAdministratif">
          Compte administratif de la structure
        </th>,
      ]}
      headings={[
        <th scope="col" key="annee" className="!border-r-1">
          Année
        </th>,
        <th scope="col" key="dotationDemandee">
          Dotation <br /> demandée
        </th>,
        <th scope="col" key="dotationAccordee" className="!border-r-3">
          Dotation <br />
          accordée
        </th>,
        <th scope="col" key="totalProduitsDotationEtat">
          Total produits <br />
          <small>dont dotation État</small>
        </th>,
        <th scope="col" key="totalChargesProposeesParOperateur">
          Total charges proposées
          <br /> par opérateur
        </th>,
        <th scope="col" key="totalChargesRetenues">
          Total charges retenues
        </th>,
        <th scope="col" key="repriseEtat">
          <Tooltip
            title={
              <>
                <span>Négatif : reprise excédent</span>
                <br />
                <span>Positif : compensation déficit</span>
              </>
            }
          >
            Reprise état{" "}
            <i className="fr-icon-information-line before:scale-50 before:origin-left" />
          </Tooltip>
        </th>,
        <th scope="col" key="affectationReservesFondsDedies">
          affectation{" "}
          <small className="block">des réserves & fonds dédiés</small>
        </th>,
      ]}
      enableBorders
    >
      {years.map((year, index) => (
        <tr key={year}>
          <td className="!border-r-1">
            {year}
            <input type="hidden" {...register(`budgets.${index}.id`)} />
            <input
              type="hidden"
              value={year}
              {...register(`budgets.${index}.year`)}
            />
          </td>
          <td>
            <div className="flex items-center gap-2">
              <InputWithValidation
                name={`budgets.${index}.dotationDemandee`}
                id={`gestionBudgetaire.${index}.dotationDemandee`}
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
          <td className="!border-r-3">
            <div className="flex items-center gap-2">
              <InputWithValidation
                name={`budgets.${index}.dotationAccordee`}
                id={`gestionBudgetaire.${index}.dotationAccordee`}
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
          <td>
            <div className="flex items-center gap-2">
              <InputWithValidation
                name={`budgets.${index}.totalProduits`}
                id={`gestionBudgetaire.${index}.totalProduits`}
                control={control}
                type="number"
                min={0}
                label=""
                className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                variant="simple"
                disabled={[0, 1].includes(index)}
              />
              &nbsp;€
            </div>
          </td>
          <td>
            <div className="flex items-center gap-2">
              <InputWithValidation
                name={`budgets.${index}.totalChargesProposees`}
                id={`gestionBudgetaire.${index}.totalChargesProposees`}
                control={control}
                type="number"
                min={0}
                label=""
                className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                variant="simple"
                disabled={[0, 1].includes(index)}
              />
              &nbsp;€
            </div>
          </td>
          <td>
            <div className="flex items-center gap-2">
              <InputWithValidation
                name={`budgets.${index}.totalCharges`}
                id={`gestionBudgetaire.${index}.totalCharges`}
                control={control}
                type="number"
                min={0}
                label=""
                className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                variant="simple"
                disabled={[0, 1].includes(index)}
              />
              &nbsp;€
            </div>
          </td>
          <td>
            <div className="flex items-center gap-2">
              <InputWithValidation
                name={`budgets.${index}.repriseEtat`}
                id={`gestionBudgetaire.${index}.repriseEtat`}
                control={control}
                type="number"
                label=""
                className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                variant="simple"
                disabled={[0, 1].includes(index)}
              />
              &nbsp;€
            </div>
          </td>
          <td>
            <div className="flex items-center gap-2">
              <InputWithValidation
                name={`budgets.${index}.affectationReservesFondsDedies`}
                id={`gestionBudgetaire.${index}.affectationReservesFondsDedies`}
                control={control}
                type="number"
                min={0}
                label=""
                className="mb-0 mx-auto items-center [&_p]:hidden [&_input]:w-full"
                variant="simple"
                disabled={[0, 1].includes(index)}
              />
              &nbsp;€
            </div>
          </td>
        </tr>
      ))}
    </Table>
  );
};
