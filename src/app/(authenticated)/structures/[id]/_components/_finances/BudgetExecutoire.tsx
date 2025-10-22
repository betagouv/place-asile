import { ReactElement } from "react";

import { InformationCard } from "@/app/components/InformationCard";
import { formatCurrency, formatNumber } from "@/app/utils/number.util";

import { useStructureContext } from "../../_context/StructureClientContext";

export const BudgetExecutoire = (): ReactElement => {
  const { structure } = useStructureContext();
  const budget = structure?.budgets?.[structure?.budgets?.length - 1];

  return (
    <div className="flex">
      <div className="pr-4">
        <InformationCard
          primaryInformation={formatCurrency(budget?.dotationAccordee)}
          secondaryInformation="dotation globale de financement"
        />
      </div>
      <div className="pr-4">
        <InformationCard
          primaryInformation={formatNumber(budget?.ETP)}
          secondaryInformation="ETP"
        />
      </div>
      <div className="pr-4">
        <InformationCard
          primaryInformation={formatNumber(budget?.tauxEncadrement)}
          secondaryInformation="places gérées par un ETP"
        />
      </div>
      <div className="pr-4">
        <InformationCard
          primaryInformation={formatCurrency(budget?.coutJournalier)}
          secondaryInformation="coût place journalier"
        />
      </div>
    </div>
  );
};
