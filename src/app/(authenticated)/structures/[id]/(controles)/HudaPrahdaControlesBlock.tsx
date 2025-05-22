import { Block } from "@/app/components/common/Block";
import { InformationCard } from "@/app/components/InformationCard";
import { Evaluation } from "@/types/evaluation.type";
import { EvenementIndesirableGrave } from "@/types/evenement-indesirable-grave.type";
import { ReactElement } from "react";
import { EvaluationTable } from "./EvaluationTable";
import { EIGTable } from "./EIGTable";
import { getLastVisitInMonths } from "@/app/utils/structure.util";
import { DemarchesSimplifieesInfo } from "./DemarchesSimplifiesInfo";
import { ControleAccordion } from "./ControleAccordion";

export const HudaPrahdaControlesBlock = ({
  evaluations,
  evenementsIndesirablesGraves,
}: Props): ReactElement => {
  return (
    <Block title="Controle qualité" iconClass="fr-icon-search-line">
      <div className="flex">
        <div className="pr-2">
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

type Props = {
  evaluations: Evaluation[];
  evenementsIndesirablesGraves: EvenementIndesirableGrave[];
};
