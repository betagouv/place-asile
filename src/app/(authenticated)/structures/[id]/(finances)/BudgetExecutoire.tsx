import { InformationCard } from "@/app/components/InformationCard";
import { Budget } from "@/types/budget.type";
import { ReactElement } from "react";

export const BudgetExecutoire = ({ budgets }: Props): ReactElement => {
  const budget = budgets[0];
  return (
    <div className="flex">
      <div className="pr-2">
        <InformationCard
          primaryInformation={`${budget?.dotationAccordee || 0} €`}
          secondaryInformation="dotation globale de financement"
        />
      </div>
      <div className="pr-2">
        <InformationCard
          primaryInformation={budget?.ETP || 0}
          secondaryInformation="ETP"
        />
      </div>
      <div className="pr-2">
        <InformationCard
          primaryInformation={budget?.tauxEncadrement || 0}
          secondaryInformation="places gérées par un ETP"
        />
      </div>
      <div className="pr-2">
        <InformationCard
          primaryInformation={`${budget?.coutJournalier || 0} €`}
          secondaryInformation="coût place journalier"
        />
      </div>
    </div>
  );
};

type Props = {
  budgets: Budget[];
};
