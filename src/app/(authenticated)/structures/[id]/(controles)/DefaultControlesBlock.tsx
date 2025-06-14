import { Block } from "@/app/components/common/Block";
import { InformationCard } from "@/app/components/InformationCard";
import { ReactElement } from "react";
import { EvaluationTable } from "./EvaluationTable";
import { ControleTable } from "./ControleTable";
import { EIGTable } from "./EIGTable";
import { getLastVisitInMonths } from "@/app/utils/structure.util";
import { DemarchesSimplifieesInfo } from "./DemarchesSimplifiesInfo";
import { ControleAccordion } from "./ControleAccordion";
import { useStructureContext } from "../context/StructureContext";

export const DefaultControlesBlock = (): ReactElement => {
  const { structure } = useStructureContext();
  const evaluations = structure.evaluations || [];
  const controles = structure.controles || [];
  const evenementsIndesirablesGraves =
    structure.evenementsIndesirablesGraves || [];
  return (
    <Block title="Controle qualité" iconClass="fr-icon-search-line">
      <div className="flex">
        <div className="pr-2">
          <InformationCard
            primaryInformation={`${getLastVisitInMonths(
              evaluations,
              controles
            )} mois`}
            secondaryInformation="depuis la dernière visite"
          />
        </div>
        <div className="pr-2">
          <InformationCard
            primaryInformation={`${evaluations[0]?.note}/5`}
            secondaryInformation="de moyenne à la dernière évaluation"
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
          title="Inspections-contrôles"
          lastVisit={controles[0]?.date}
        >
          <ControleTable controles={controles} />
        </ControleAccordion>
        <ControleAccordion
          title="Événements indésirables graves"
          lastVisit={evenementsIndesirablesGraves[0]?.evenementDate}
        >
          <>
            <EIGTable
              evenementsIndesirablesGraves={evenementsIndesirablesGraves}
            />
            <DemarchesSimplifieesInfo />
          </>
        </ControleAccordion>
      </div>
    </Block>
  );
};
