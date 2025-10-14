import { StructureState } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";

import { Block } from "@/app/components/common/Block";
import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";

import { useStructureContext } from "../context/StructureClientContext";
import { BudgetExecutoire } from "./BudgetExecutoire";
import { DetailAffectations } from "./DetailAffectations";
import { DocumentsAdministratifs } from "./DocumentsAdministratifs";
import { DotationChart } from "./DotationChart";
import { GestionBudgetaireAutoriseeSansCpomTable } from "./GestionBudgetaireAutoriseeSansCpomTable";
import { GestionBudgetaireAvecCpomTable } from "./GestionBudgetaireAvecCpomTable";
import { GestionBudgetaireSubventionneeSansCpomTable } from "./GestionBudgetaireSubventionneeSansCpomTable";
import { HistoriqueBudgets } from "./HistoriqueBudgets";

export const FinancesBlock = (): ReactElement => {
  const { structure } = useStructureContext();

  const router = useRouter();

  const isAutorisee = isStructureAutorisee(structure.type);
  const isConventionnee = isStructureSubventionnee(structure.type);
  const isDetailAffectationsDisplayed =
    isAutorisee || (isConventionnee && structure.cpom);

  const getGestionBudgetaireComponent = (): ReactElement => {
    if (!structure.cpom) {
      if (isAutorisee) {
        return <GestionBudgetaireAutoriseeSansCpomTable />;
      }
      if (isConventionnee) {
        return <GestionBudgetaireSubventionneeSansCpomTable />;
      }
    }
    return <GestionBudgetaireAvecCpomTable />;
  };
  return (
    <Block
      title="Finances"
      iconClass="fr-icon-money-euro-box-line"
      onEdit={
        structure.state === StructureState.FINALISE
          ? () => {
              router.push(
                `/structures/${structure.id}/modification/04-finance`
              );
            }
          : undefined
      }
    >
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
      <div className="pb-5">{getGestionBudgetaireComponent()}</div>
      {isDetailAffectationsDisplayed && (
        <div className="pb-5">
          <DetailAffectations />
        </div>
      )}
      <h4 className="text-title-blue-france pb-2 fr-h6 mb-0">
        Documents administratifs et financiers transmis par l’opérateur
      </h4>
      {isConventionnee && (
        <h5 className="text-sm text-gray-500 font-normal italic">
          Retrouvez les Plans Pluriannuels d’Investissements (PPI) dans la
          section “Actes administratifs” s’ils existent et qu’ils ont été
          importés.
        </h5>
      )}
      <DocumentsAdministratifs />
    </Block>
  );
};
