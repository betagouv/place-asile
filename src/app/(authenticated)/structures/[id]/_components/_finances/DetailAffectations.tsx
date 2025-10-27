import Accordion from "@codegouvfr/react-dsfr/Accordion";
import Table from "@codegouvfr/react-dsfr/Table";
import { ReactElement } from "react";

import styles from "@/app/components/common/Accordion.module.css";
import { formatCurrency } from "@/app/utils/number.util";
import { BudgetApiType } from "@/schemas/api/budget.schema";

import { useStructureContext } from "../../_context/StructureClientContext";

export const DetailAffectations = (): ReactElement => {
  const { structure } = useStructureContext();

  const isBudgetEmpty = (budget: BudgetApiType): boolean => {
    return !!budget.affectationReservesFondsDedies;
  };

  const getBudgets = () => {
    if (!structure?.budgets) {
      return [];
    }
    return structure.budgets
      .filter(isBudgetEmpty)
      .map((budget) => [
        new Date(budget.date).getFullYear(),
        <span key={budget.id}>
          {formatCurrency(budget.affectationReservesFondsDedies)}
        </span>,
        <span key={budget.id}>
          {formatCurrency(budget.reserveInvestissement)}
        </span>,
        <span key={budget.id}>
          {formatCurrency(budget.chargesNonReconductibles)}
        </span>,
        <span key={budget.id}>
          {formatCurrency(budget.reserveCompensationDeficits)}
        </span>,
        <span key={budget.id}>
          {formatCurrency(budget.reserveCompensationBFR)}
        </span>,
        <span key={budget.id}>
          {formatCurrency(budget.reserveCompensationAmortissements)}
        </span>,
        structure.cpom && (
          <span key={budget.id}>{formatCurrency(budget.fondsDedies)}</span>
        ),
        <span key={budget.id}>{formatCurrency(budget.reportANouveau)}</span>,
        <span key={budget.id}>{formatCurrency(budget.autre)}</span>,
        budget.commentaire,
      ]);
  };

  return (
    <Accordion
      label={
        structure.cpom
          ? "Détail affectations réserves, provisions et fonds dédiés du CPOM"
          : "Détail affectations réserves et provisions"
      }
      className={styles["custom-accordion"]}
    >
      <Table
        bordered={true}
        className="m-0 [&>table]:w-[unset] [&>table>tbody>tr>td]:text-center text-mention-grey [&>table>thead]:text-mention-grey"
        caption=""
        data={getBudgets()}
        headers={[
          "ANNÉE",
          "TOTAL",
          "RÉSERVE DÉDIÉE À L'INVESTISSMENT",
          "CHARGES NON RECONDUCTIBLES",
          "RÉSERVE DE COMPENSATION DES DÉFICITS",
          "RÉSERVE DE COUVERTURE DE BFR",
          "RÉSERVE DE COMPENSATION DES AMORTIS.",
          structure.cpom && "FONDS DÉDIÉS",
          "REPORT A NOUVEAU",
          "AUTRE",
          "COMMENTAIRE",
        ]}
      />
      <span className="text-sm m-3">
        Ce tableau reflète l’affectation de l’excédent pour chaque année (flux).
        Il ne constitue en aucun cas un calcul ou stock.
      </span>
    </Accordion>
  );
};
