import { useRouter } from "next/navigation";
import { ReactElement } from "react";

import { Block } from "@/app/components/common/Block";
import { InformationCard } from "@/app/components/InformationCard";
// import { EIGTable } from "./EIGTable";
import { getLastVisitInMonths } from "@/app/utils/structure.util";
import { StructureState } from "@/types/structure.type";

import { useStructureContext } from "../context/StructureClientContext";
// import { DemarchesSimplifieesInfo } from "./DemarchesSimplifiesInfo";
import { ControleAccordion } from "./ControleAccordion";
// import { EvaluationTable } from "./EvaluationTable";
import { ControleTable } from "./ControleTable";

export const DefaultControlesBlock = (): ReactElement => {
  const { structure } = useStructureContext();

  const router = useRouter();

  const evaluations = structure.evaluations || [];
  const controles = structure.controles || [];
  // const evenementsIndesirablesGraves =
  //   structure.evenementsIndesirablesGraves || [];

  return (
    <Block
      title="Controle qualité"
      iconClass="fr-icon-search-line"
      onEdit={
        structure.state === StructureState.FINALISE
          ? () => {
              router.push(
                `/structures/${structure.id}/modification/05-qualite`
              );
            }
          : undefined
      }
    >
      <div className="flex">
        <div className="pr-4">
          <InformationCard
            primaryInformation={`${getLastVisitInMonths(
              evaluations,
              controles
            )} mois`}
            secondaryInformation="depuis la dernière visite"
          />
        </div>
        {/* <div className="pr-4">
          <InformationCard
            primaryInformation={`${evaluations[0]?.note}/5`}
            secondaryInformation="de moyenne à la dernière évaluation"
          />
        </div> */}
        {/* <InformationCard
          primaryInformation={evenementsIndesirablesGraves.length}
          secondaryInformation="événements indésirables graves"
        /> */}
      </div>
      <div className="pt-3">
        {/* <ControleAccordion title="Évaluations" lastVisit={evaluations[0]?.date}>
          <EvaluationTable evaluations={evaluations} />
        </ControleAccordion> */}
        <ControleAccordion
          title="Inspections-contrôles"
          lastVisit={controles[0]?.date}
        >
          <ControleTable />
        </ControleAccordion>
        {/* <ControleAccordion
          title="Événements indésirables graves"
          lastVisit={evenementsIndesirablesGraves[0]?.evenementDate}
        >
          <>
            <EIGTable />
            <DemarchesSimplifieesInfo />
          </>
        </ControleAccordion> */}
      </div>
    </Block>
  );
};
