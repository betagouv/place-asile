import { Block } from "@/app/components/common/Block";
import { ReactElement } from "react";
import { BudgetExecutoire } from "./BudgetExecutoire";
import { Budget } from "@/types/budget.type";

export const FinancesBlock = ({ budgets }: Props): ReactElement => {
  return (
    <Block title="Finances" iconClass="fr-icon-money-euro-box-line">
      <BudgetExecutoire budgets={budgets} />
    </Block>
  );
};

type Props = {
  budgets: Budget[];
};
