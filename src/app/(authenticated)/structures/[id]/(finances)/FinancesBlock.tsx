import { Block } from "@/app/components/common/Block";
import { ReactElement } from "react";
import { BudgetExecutoire } from "./BudgetExecutoire";
import { Budget } from "@/types/budget.type";
import { HistoriqueBudgets } from "./HistoriqueBudgets";

export const FinancesBlock = ({ budgets }: Props): ReactElement => {
  return (
    <Block title="Finances" iconClass="fr-icon-money-euro-box-line">
      <div className="pb-2">
        <h4 className="text-title-blue-france pb-2 fr-h6">
          Budget exécutoire pour {new Date().getFullYear() - 1}
        </h4>
        <BudgetExecutoire budgets={budgets} />
      </div>
      <div className="pb-5">
        <HistoriqueBudgets budgets={budgets} />
      </div>
      <h4 className="text-title-blue-france pb-2 fr-h6">
        Dotation et équilibre économique
      </h4>
      <h4 className="text-title-blue-france pb-2 fr-h6">Gestion budgétaire</h4>
      <h4 className="text-title-blue-france pb-2 fr-h6">
        Documents administratifs et financiers transmis par l’opérateur
      </h4>
    </Block>
  );
};

type Props = {
  budgets: Budget[];
};
