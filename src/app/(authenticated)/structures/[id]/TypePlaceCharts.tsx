import { ReactElement } from "react";
import { PieChart } from "@/app/components/common/PieChart";
import { getPercentage } from "@/app/utils/common.util";

export const TypePlaceCharts = ({
  placesAutorisees,
  placesPmr,
  placesLgbt,
  placesFvvTeh,
  placesQPV,
  placesLogementsSociaux,
}: Props): ReactElement => {
  return (
    <>
      <PieChart
        x={[]}
        y={[placesPmr, placesAutorisees - placesPmr]}
        fill={true}
        color={["yellow-tournesol", "beige-gris-galet"]}
      >
        <div className="fr-pt-1w text-center">
          <strong>{placesPmr}</strong> places PMR{" "}
          <span className="text-mention-grey">
            ({getPercentage(placesPmr, placesAutorisees)})
          </span>
        </div>
      </PieChart>
      <PieChart
        x={[]}
        y={[
          placesLgbt,
          placesFvvTeh,
          placesAutorisees - placesLgbt - placesFvvTeh,
        ]}
        fill={true}
        color={["yellow-tournesol", "yellow-moutarde", "beige-gris-galet"]}
      >
        <div className="fr-pt-1w text-center">
          <strong>{placesLgbt}</strong> places LGBT{" "}
          <span className="text-mention-grey">
            ({getPercentage(placesLgbt, placesAutorisees)})
          </span>{" "}
          et <strong>{placesFvvTeh}</strong> places FVV-TEH{" "}
          <span className="text-mention-grey">
            ({getPercentage(placesFvvTeh, placesAutorisees)})
          </span>
        </div>
      </PieChart>
      <PieChart
        x={[]}
        y={[placesQPV, placesAutorisees - placesQPV]}
        fill={true}
        color={["yellow-tournesol", "beige-gris-galet"]}
      >
        <div className="fr-pt-1w text-center">
          <strong>{placesQPV}</strong> places QPV{" "}
          <span className="text-mention-grey">
            ({getPercentage(placesQPV, placesAutorisees)})
          </span>
        </div>
      </PieChart>
      <PieChart
        x={[]}
        y={[placesLogementsSociaux, placesAutorisees - placesLogementsSociaux]}
        fill={true}
        color={["yellow-tournesol", "beige-gris-galet"]}
      >
        <div className="fr-pt-1w text-center">
          <strong>{placesLogementsSociaux}</strong> places logements sociaux{" "}
          <span className="text-mention-grey">
            ({getPercentage(placesLogementsSociaux, placesAutorisees)})
          </span>
        </div>
      </PieChart>
    </>
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
