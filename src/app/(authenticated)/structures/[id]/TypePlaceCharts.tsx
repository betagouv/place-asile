import { ReactElement } from "react";
import { PieChart } from "@/app/components/common/PieChart";

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
          <span className="text-grey">
            ({Math.floor((placesPmr / placesAutorisees) * 100)}%)
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
        x={[]}
        y={[placesQPV, placesAutorisees - placesQPV]}
        fill={true}
        color={["yellow-tournesol", "beige-gris-galet"]}
      >
        <div className="fr-pt-1w text-center">
          <strong>{placesQPV}</strong> places QPV{" "}
          <span className="text-grey">
            ({Math.floor((placesQPV / placesAutorisees) * 100)}%)
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
          <span className="text-grey">
            ({Math.floor((placesLogementsSociaux / placesAutorisees) * 100)}%)
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
