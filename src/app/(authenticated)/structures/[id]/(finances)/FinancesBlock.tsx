import { Block } from "@/app/components/common/Block";
import { ReactElement } from "react";
import { BudgetExecutoire } from "./BudgetExecutoire";
import { HistoriqueBudgets } from "./HistoriqueBudgets";
import { DotationChart } from "./DotationChart";
import { GestionBudgetaireTable } from "./GestionBudgetaireTable";

export const FinancesBlock = (): ReactElement => {
  return (
    <Block title="Finances" iconClass="fr-icon-money-euro-box-line">
      <div className="pb-2">
        <h4 className="text-title-blue-france pb-2 fr-h6">
          Budget exécutoire pour {new Date().getFullYear() - 1}
        </h4>
        <BudgetExecutoire />
      </div>
      <div className="pb-5">
        <HistoriqueBudgets />
      </div>
      <h4 className="text-title-blue-france pb-2 fr-h6">
        Dotation et équilibre économique
      </h4>
      <div className="pb-5">
        <DotationChart />
      </div>
      <h4 className="text-title-blue-france fr-h6">Gestion budgétaire</h4>
      <div className="pb-5">
        <GestionBudgetaireTable />
      </div>
      <h4 className="text-title-blue-france pb-2 fr-h6 mb-0">
        Documents administratifs et financiers transmis par l’opérateur
      </h4>
      <h5 className="text-sm text-gray-500 font-normal italic">
        Retrouvez également les Plans Pluriannuels d’Investissements (PPI) dans
        la section “Actes administratifs”.
      </h5>
    </Block>
  );
};
