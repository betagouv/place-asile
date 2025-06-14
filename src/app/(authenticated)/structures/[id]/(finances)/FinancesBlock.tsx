import { Block } from "@/app/components/common/Block";
import { ReactElement } from "react";
import { BudgetExecutoire } from "./BudgetExecutoire";
import { useStructureContext } from "../context/StructureContext";

export const FinancesBlock = (): ReactElement => {
  // TODO : Refac props from blocks to remove the props and pass them from context
  const { structure } = useStructureContext();

  return (
    <Block title="Finances" iconClass="fr-icon-money-euro-box-line">
      <BudgetExecutoire budgets={structure?.budgets || []} />
    </Block>
  );
};
