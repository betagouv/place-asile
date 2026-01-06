import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import { useForm, useFormContext } from "react-hook-form";

import { useStructureContext } from "@/app/(authenticated)/structures/[id]/_context/StructureClientContext";
import { Badge } from "@/app/components/common/Badge";
import { Table } from "@/app/components/common/Table";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import { getYearRange } from "@/app/utils/date.util";
import { isStructureInCpom } from "@/app/utils/structure.util";
import {
  DOTATION_ACCORDEE_DISABLED_YEARS,
  DOTATION_DEMANDEE_DISABLED_YEARS_START,
  OTHER_DISABLED_YEARS_START,
  TOTAL_PRODUITS_DISABLED_YEARS_START,
} from "@/constants";

import { BudgetTableCommentLine } from "./BudgetTableCommentLine";
import { BudgetTableLine } from "./BudgetTableLine";
import { BudgetTableTitleLine } from "./BudgetTableTitleLine";

export const StructureAutorisee = () => {
  const parentFormContext = useFormContext();

  const { structure } = useStructureContext();

  const { years } = getYearRange({ order: "desc" });

  const localForm = useForm();
  const { control, formState, register } = parentFormContext || localForm;

  const errors = formState.errors;
  const hasErrors =
    Array.isArray(errors.budgets) &&
    errors.budgets.some(
      (budgetItemErrors: Record<string, unknown>) =>
        budgetItemErrors?.dotationDemandee ||
        budgetItemErrors?.dotationAccordee ||
        budgetItemErrors?.totalProduits ||
        budgetItemErrors?.totalProduitsProposes ||
        budgetItemErrors?.totalCharges ||
        budgetItemErrors?.totalChargesProposees ||
        budgetItemErrors?.repriseEtat ||
        budgetItemErrors?.affectationReservesFondsDedies ||
        budgetItemErrors?.commentaire
    );

  if (!structure.budgets) {
    return null;
  }

  return (
    <Table
      ariaLabelledBy="gestionBudgetaire"
      hasErrors={hasErrors}
      headings={[
        " ",
        ...years.map((year) => (
          <th scope="col" key={year}>
            {year}{" "}
            {isStructureInCpom(structure, year) ? (
              <Badge type="info">CPOM</Badge>
            ) : (
              <Badge type="success">Hors CPOM</Badge>
            )}
          </th>
        )),
      ]}
      enableBorders
    >
      <BudgetTableTitleLine label="Budget" />
      <BudgetTableLine
        name="dotationDemandee"
        label="Dotation demandée"
        budgets={structure.budgets}
        disabledYearsStart={DOTATION_DEMANDEE_DISABLED_YEARS_START}
      />
      <BudgetTableLine
        name="dotationAccordee"
        label="Dotation accordée"
        budgets={structure.budgets}
        disabledYearsStart={DOTATION_ACCORDEE_DISABLED_YEARS}
      />
      <BudgetTableTitleLine label="Résultat" />
      <BudgetTableLine
        name="totalProduitsProposes"
        label="Total produits proposés"
        subLabel="dont dotation État"
        budgets={structure.budgets}
        disabledYearsStart={TOTAL_PRODUITS_DISABLED_YEARS_START}
      />
      <BudgetTableLine
        name="totalProduits"
        label="Total produits retenus"
        subLabel="dont dotation État"
        budgets={structure.budgets}
        disabledYearsStart={TOTAL_PRODUITS_DISABLED_YEARS_START}
      />
      <BudgetTableLine
        name="totalChargesProposees"
        label="Total charges proposées"
        subLabel="par l'opérateur"
        budgets={structure.budgets}
        disabledYearsStart={OTHER_DISABLED_YEARS_START}
      />
      <BudgetTableLine
        name="totalCharges"
        label="Total charges retenu"
        subLabel="par l'autorité tarifaire"
        budgets={structure.budgets}
        disabledYearsStart={OTHER_DISABLED_YEARS_START}
      />
      <BudgetTableLine
        name="repriseEtat"
        label="Reprise état"
        budgets={structure.budgets}
        disabledYearsStart={OTHER_DISABLED_YEARS_START}
      />
      <BudgetTableLine
        name="affectationReservesFondsDedies"
        label="Affectation réserves & fonds dédiés"
        budgets={structure.budgets}
        disabledYearsStart={OTHER_DISABLED_YEARS_START}
      />
      <BudgetTableTitleLine label="Détail affectation" />
      <BudgetTableLine
        name="reserveInvestissement"
        label="Réserve"
        subLabel="dédiée à l'investissement"
        budgets={structure.budgets}
        disabledYearsStart={OTHER_DISABLED_YEARS_START}
      />
      <BudgetTableLine
        name="chargesNonReconductibles"
        label="Charges"
        subLabel="non reductibles"
        budgets={structure.budgets}
        disabledYearsStart={OTHER_DISABLED_YEARS_START}
      />
      <BudgetTableLine
        name="reserveCompensationDeficits"
        label="Réserve de compensation "
        subLabel="des déficits"
        budgets={structure.budgets}
        disabledYearsStart={OTHER_DISABLED_YEARS_START}
      />
      <BudgetTableLine
        name="reserveCompensationBFR"
        label="Réserve de couverture"
        subLabel="de BFR"
        budgets={structure.budgets}
        disabledYearsStart={OTHER_DISABLED_YEARS_START}
      />
      <BudgetTableLine
        name="reserveCompensationAmortissements"
        label="Réserve de compensation"
        subLabel="des amortissements"
        budgets={structure.budgets}
        disabledYearsStart={OTHER_DISABLED_YEARS_START}
      />
      <BudgetTableLine
        name="reportANouveau"
        label="Report à nouveau"
        budgets={structure.budgets}
        disabledYearsStart={OTHER_DISABLED_YEARS_START}
      />
      <BudgetTableLine
        name="autre"
        label="Autre"
        budgets={structure.budgets}
        disabledYearsStart={OTHER_DISABLED_YEARS_START}
      />
      <BudgetTableCommentLine
        name="commentaire"
        label="Commentaire"
        budgets={structure.budgets}
        disabledYearsStart={OTHER_DISABLED_YEARS_START}
      />
    </Table>
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
        <th
          scope="col"
          colSpan={2}
          key="compteAdministratif"
          className="!border-r-3"
        >
          Compte administratif de la structure
        </th>,
        <th scope="col" key="compteAdministratifCPOM" colSpan={3}>
          Compte administratif du CPOM
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
        <th scope="col" key="totalChargesRetenues" className="!border-r-3">
          Total charges <br />
          retenues
        </th>,
        <th scope="col" key="cumulResultatsNetsCPOM">
          cumul résultats <br />
          NETs du CPOM
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
              value={`${year}-01-01T013:00:00.000Z`}
              {...register(`budgets.${index}.date`)}
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
          <td className="!border-r-3">
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
                name={`budgets.${index}.cumulResultatsNetsCPOM`}
                id={`gestionBudgetaire.${index}.cumulResultatsNetsCPOM`}
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
