import Accordion from "@codegouvfr/react-dsfr/Accordion";
import Table from "@codegouvfr/react-dsfr/Table";
import { ReactElement } from "react";

import styles from "@/app/components/common/Accordion.module.css";
import { formatCurrency, formatNumber } from "@/app/utils/number.util";
import { isStructureAutorisee } from "@/app/utils/structure.util";

import { useStructureContext } from "../context/StructureClientContext";

export const HistoriqueBudgets = (): ReactElement => {
  const { structure } = useStructureContext();

  const getBudgets = () => {
    if (!structure?.budgets) {
      return [];
    }
    return structure.budgets.map((budget) => [
      new Date(budget.date).getFullYear(),
      formatNumber(budget.ETP),
      formatNumber(budget.tauxEncadrement),
      formatCurrency(budget.coutJournalier),
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
        className="m-0 [&>table]:w-[unset] [&>table>tbody>tr>td]:text-center text-mention-grey [&>table>thead]:text-mention-grey"
        caption=""
        data={getBudgets()}
        headers={["ANNÉE", "ETP", "TAUX D'ENCADREMENT", "COÛT JOURNALIER"]}
      />
    </Accordion>
  );
};
