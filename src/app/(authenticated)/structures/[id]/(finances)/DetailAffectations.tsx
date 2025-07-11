import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { ReactElement } from "react";
import styles from "@/app/components/common/Accordion.module.css";
import Table from "@codegouvfr/react-dsfr/Table";
import { useStructureContext } from "../context/StructureClientContext";
import { Budget } from "@/types/budget.type";

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
        `${budget.affectationReservesFondsDedies} €`,
        `${budget.reserveInvestissement} €`,
        `${budget.chargesNonReconductibles} €`,
        `${budget.reserveCompensationDeficits} €`,
        `${budget.reserveCompensationBFR} €`,
        `${budget.reserveCompensationAmortissements} €`,
        `${budget.fondsDedies} €`,
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
        className="m-0"
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
