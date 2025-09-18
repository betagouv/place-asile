import { ReactElement } from "react";

import { InformationCard } from "@/app/components/InformationCard";
import { formatCurrency, formatNumber } from "@/app/utils/number.util";

import { useStructureContext } from "../context/StructureClientContext";

export const BudgetExecutoire = (): ReactElement => {
  const { structure } = useStructureContext();
  const budget = structure?.budgets?.[structure?.budgets?.length - 1];

  return (
    <div className="flex">
      <div className="pr-4">
        <InformationCard
          primaryInformation={formatCurrency(budget?.dotationAccordee || 0)}
          secondaryInformation="dotation globale de financement"
        />
      </div>
      <div className="pr-4">
        <InformationCard
          primaryInformation={formatNumber(budget?.ETP || 0)}
          secondaryInformation="ETP"
        />
      </div>
      <div className="pr-4">
        <InformationCard
          primaryInformation={formatNumber(budget?.tauxEncadrement || 0)}
          secondaryInformation="places gérées par un ETP"
        />
      </div>
      <div className="pr-4">
        <InformationCard
          primaryInformation={formatCurrency(budget?.coutJournalier || 0)}
          secondaryInformation="coût place journalier"
        />
      </div>
    </div>
  );
};
