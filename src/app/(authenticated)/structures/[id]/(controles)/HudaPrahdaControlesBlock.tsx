import { Block } from "@/app/components/common/Block";
import { InformationCard } from "@/app/components/InformationCard";
import { ReactElement } from "react";
import { EvaluationTable } from "./EvaluationTable";
import { EIGTable } from "./EIGTable";
import { getLastVisitInMonths } from "@/app/utils/structure.util";
import { DemarchesSimplifieesInfo } from "./DemarchesSimplifiesInfo";
import { ControleAccordion } from "./ControleAccordion";
import { useStructureContext } from "../context/StructureClientContext";

export const HudaPrahdaControlesBlock = (): ReactElement => {
  const { structure } = useStructureContext();

  const evaluations = structure.evaluations || [];
  const evenementsIndesirablesGraves =
    structure.evenementsIndesirablesGraves || [];

  return (
    <Block title="Controle qualité" iconClass="fr-icon-search-line">
      <div className="flex">
        <div className="pr-4">
          <InformationCard
            primaryInformation={`${getLastVisitInMonths(evaluations, [])} mois`}
            secondaryInformation="depuis la dernière visite"
          />
        </div>
        <InformationCard
          primaryInformation={evenementsIndesirablesGraves.length}
          secondaryInformation="événements indésirables graves"
        />
      </div>
      <div className="pt-3">
        <ControleAccordion title="Évaluations" lastVisit={evaluations[0]?.date}>
          <EvaluationTable evaluations={evaluations} />
        </ControleAccordion>
        <ControleAccordion
          title="Événements indésirables graves"
          lastVisit={evenementsIndesirablesGraves[0]?.evenementDate}
        >
          <>
            <EIGTable />
            <DemarchesSimplifieesInfo />
          </>
        </ControleAccordion>
      </div>
    </Block>
  );
};
