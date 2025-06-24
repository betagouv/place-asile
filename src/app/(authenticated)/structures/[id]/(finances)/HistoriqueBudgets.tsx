import { Budget } from "@/types/budget.type";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { ReactElement } from "react";
import styles from "@/app/components/common/Accordion.module.css";
import Table from "@codegouvfr/react-dsfr/Table";

export const HistoriqueBudgets = ({ budgets }: Props): ReactElement => {
  const getBudgets = () => {
    return budgets.map((budget) => [
      new Date(budget.date).getFullYear(),
      budget.ETP,
      budget.tauxEncadrement,
      budget.coutJournalier,
    ]);
  };

  return (
    <Accordion
      label="Historique selon compte administratif"
      className={styles["custom-accordion"]}
    >
      <Table
        bordered={true}
        className="fr-m-0"
        caption=""
        data={getBudgets()}
        headers={["ANNÉE", "ETP", "TAUX D'ENCADREMENT", "COÛT JOURNALIER"]}
      />
    </Accordion>
  );
};

type Props = {
  budgets: Budget[];
};
