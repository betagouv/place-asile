import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { ReactElement } from "react";
import styles from "@/app/components/common/Accordion.module.css";
import Table from "@codegouvfr/react-dsfr/Table";
import { useStructureContext } from "../context/StructureClientContext";
import { isStructureAutorisee } from "@/app/utils/structure.util";

export const HistoriqueBudgets = (): ReactElement => {
  const { structure } = useStructureContext();

  const getBudgets = () => {
    if (!structure?.budgets) {
      return [];
    }
    return structure.budgets.map((budget) => [
      new Date(budget.date).getFullYear(),
      budget.ETP,
      budget.tauxEncadrement,
      budget.coutJournalier,
    ]);
  };

  return (
    <Accordion
      label={
        isStructureAutorisee(structure.type)
          ? "Historique selon compte administratif"
          : "Historique selon compte-rendu financier"
      }
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
