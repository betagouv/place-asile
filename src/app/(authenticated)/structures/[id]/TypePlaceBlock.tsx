"use client";

import { ReactElement } from "react";
import { Block } from "@/app/components/common/Block";
import { InformationCard } from "@/app/components/InformationCard";
import { PieChart } from "@/app/components/common/PieChart";

export const TypePlaceBlock = ({
  placesAutorisees,
  placesPmr,
  placesLgbt,
  placesFvvTeh,
  placesQPV,
  placesLogementsSociaux,
}: Props): ReactElement => {
  return (
    <Block title="Type de place" iconClass="fr-icon-map-pin-2-line">
      <InformationCard
        primaryInformation={placesAutorisees}
        secondaryInformation="places autorisées"
      />
      <div className="fr-pt-3w d-flex">
        <PieChart
          x={[
            "Places PMR" as unknown as number,
            "Places non-PMR" as unknown as number,
          ]}
          y={[placesPmr, placesAutorisees - placesPmr]}
          fill={true}
          color={["yellow-tournesol", "beige-gris-galet"]}
        >
          <div className="fr-pt-1w">
            <strong>{placesPmr}</strong> places PMR{" "}
            <span className="text-grey">
              ({Math.floor((placesPmr / placesAutorisees) * 100)}%)
            </span>
          </div>
        </PieChart>
        <PieChart
          x={[
            "Places LGBT" as unknown as number,
            "Places FVV-TEH" as unknown as number,
            "Places non-LGBT ou FVV-TEH" as unknown as number,
          ]}
          y={[
            placesLgbt,
            placesFvvTeh,
            placesAutorisees - placesLgbt - placesFvvTeh,
          ]}
          fill={true}
          color={["yellow-tournesol", "yellow-moutarde", "beige-gris-galet"]}
        >
          <div className="fr-pt-1w">
            <strong>{placesLgbt}</strong> places LGBT{" "}
            <span className="text-grey">
              ({Math.floor((placesLgbt / placesAutorisees) * 100)}%)
            </span>{" "}
            et <strong>{placesFvvTeh}</strong> places FVV-TEH{" "}
            <span className="text-grey">
              ({Math.floor((placesFvvTeh / placesAutorisees) * 100)}%)
            </span>
          </div>
        </PieChart>
        <PieChart
          x={[
            "Places QPV" as unknown as number,
            "Places non-QPV" as unknown as number,
          ]}
          y={[placesQPV, placesAutorisees - placesQPV]}
          fill={true}
          color={["yellow-tournesol", "beige-gris-galet"]}
        >
          <div className="fr-pt-1w">
            <strong>{placesQPV}</strong> places QPV{" "}
            <span className="text-grey">
              ({Math.floor((placesQPV / placesAutorisees) * 100)}%)
            </span>
          </div>
        </PieChart>
        <PieChart
          x={[
            "Places logements sociaux" as unknown as number,
            "Places non-logements sociaux" as unknown as number,
          ]}
          y={[
            placesLogementsSociaux,
            placesAutorisees - placesLogementsSociaux,
          ]}
          fill={true}
          color={["yellow-tournesol", "beige-gris-galet"]}
        >
          <div className="fr-pt-1w">
            <strong>{placesLogementsSociaux}</strong> places logements sociaux{" "}
            <span className="text-grey">
              ({Math.floor((placesLogementsSociaux / placesAutorisees) * 100)}%)
            </span>
          </div>
        </PieChart>
      </div>
    </Block>
  );
};

type Props = {
  placesAutorisees: number;
  placesPmr: number;
  placesLgbt: number;
  placesFvvTeh: number;
  placesQPV: number;
  placesLogementsSociaux: number;
};
