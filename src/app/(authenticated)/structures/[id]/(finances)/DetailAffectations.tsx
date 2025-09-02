import Accordion from "@codegouvfr/react-dsfr/Accordion";
import Table from "@codegouvfr/react-dsfr/Table";
import { ReactElement } from "react";

import styles from "@/app/components/common/Accordion.module.css";
import { Budget } from "@/types/budget.type";

import { useStructureContext } from "../context/StructureClientContext";

export const DetailAffectations = (): ReactElement => {
  const { structure } = useStructureContext();

  const isBudgetEmpty = (budget: Budget): boolean => {
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
          {budget.affectationReservesFondsDedies}&nbsp;€
        </span>,
        <span key={budget.id}>{budget.reserveInvestissement}&nbsp;€</span>,
        <span key={budget.id}>{budget.chargesNonReconductibles}&nbsp;€</span>,
        <span key={budget.id}>
          {budget.reserveCompensationDeficits}&nbsp;€
        </span>,
        <span key={budget.id}>{budget.reserveCompensationBFR}&nbsp;€</span>,
        <span key={budget.id}>
          {budget.reserveCompensationAmortissements}&nbsp;€
        </span>,
        <span key={budget.id}>{budget.fondsDedies}&nbsp;€</span>,
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
          "RÉSERVE DÉDIÉE À L'INVESTISSMENT (10682)",
          "CHARGES NON RECONDUCTIBLES (11511 ou 111)",
          "RÉSERVE DE COMPENSATION DES DÉFICITS (10686)",
          "RÉSERVE DE COUVERTURE DE BFR (10685)",
          "RÉSERVE DE COMPENSATION DES AMORTIS. (10687)",
          "FONDS DÉDIÉS",
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
