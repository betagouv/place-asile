import { Block } from "@/app/components/common/Block";
import { ReactElement } from "react";
import { BudgetExecutoire } from "./BudgetExecutoire";

export const FinancesBlock = (): ReactElement => {
  return (
    <Block title="Finances" iconClass="fr-icon-money-euro-box-line">
      <BudgetExecutoire />
    </Block>
  );
};
