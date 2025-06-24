import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { ReactElement } from "react";
import styles from "@/app/components/common/Accordion.module.css";
import Table from "@codegouvfr/react-dsfr/Table";
import { useStructureContext } from "../context/StructureContext";
import { Budget } from "@/types/budget.type";

export const HistoriqueBudgets = (): ReactElement | null => {
  const { structure } = useStructureContext();
  const budgets = structure?.budgets;
  const getBudgets = () => {
    return budgets?.map((budget: Budget) => [
      new Date(budget.date).getFullYear(),
      budget.ETP,
      budget.tauxEncadrement,
      budget.coutJournalier,
    ]);
  };
  return budgets && budgets.length > 0 ? (
    <Accordion
      label="Historique selon compte administratif"
      className={styles["custom-accordion"]}
    >
      <Table
        bordered={true}
        className="fr-m-0"
        caption=""
        data={getBudgets() || []}
        headers={["ANNÉE", "ETP", "TAUX D'ENCADREMENT", "COÛT JOURNALIER"]}
      />
    </Accordion>
  ) : null;
};
