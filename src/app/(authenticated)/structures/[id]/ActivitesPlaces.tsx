"use client";

import { PieChart } from "@/app/components/common/PieChart";
import { getPercentage } from "@/app/utils/common.util";
import { ReactElement } from "react";

export const ActivitesPlaces = ({
  nbPlaces,
  placesIndisponibles,
  placesVacantes,
  placesPIBPI,
  placesPIdeboutees,
}: Props): ReactElement => {
  const placesDisponibles = nbPlaces - placesIndisponibles;
  const placesOccupees = placesDisponibles - placesVacantes;
  return (
    <div className="flex items-center fr-pt-3w">
      <div>
        <PieChart
          x={[]}
          y={[placesIndisponibles, nbPlaces - placesIndisponibles]}
          color={["beige-gris-galet", "yellow-moutarde"]}
          width={350}
        />
        <div className="fr-pt-1w text-center">
          <strong>{nbPlaces}</strong> places ouvertes
          <div>
            <strong>{placesIndisponibles}</strong> indisponibles (
            {getPercentage(placesIndisponibles, nbPlaces)})
          </div>
        </div>
      </div>
      <span className="fr-icon-arrow-right-s-line text-title-blue-france" />
      <div>
        <PieChart
          x={[]}
          y={[placesVacantes, placesDisponibles - placesVacantes]}
          color={["beige-gris-galet", "pink-macaron"]}
          width={350}
        />
        <div className="fr-pt-1w text-center">
          <strong>{placesDisponibles}</strong> places disponibles
          <div>
            <strong>{placesIndisponibles}</strong> vacantes (
            {getPercentage(placesVacantes, placesDisponibles)})
          </div>
          <div>
            <strong>{placesOccupees}</strong> occupées (
            {getPercentage(placesOccupees, placesDisponibles)})
          </div>
        </div>
      </div>
      <span className="fr-icon-arrow-right-s-line text-title-blue-france" />
      <div>
        <PieChart
          x={[]}
          y={[
            placesPIBPI,
            placesPIdeboutees,
            placesOccupees - placesPIBPI - placesPIdeboutees,
          ]}
          color={["blue-france", "blue-ecume", "blue-cumulus"]}
          width={350}
        />
        <div className="fr-pt-1w text-center">
          <strong>{placesOccupees}</strong> places occupées
          <div>
            <strong>{placesPIBPI}</strong> en présence indue BPI (
            {getPercentage(placesPIBPI, placesOccupees)})
          </div>
          <div>
            <strong>{placesPIdeboutees}</strong> en présence indue deboutée (
            {getPercentage(placesPIdeboutees, placesOccupees)})
          </div>
        </div>
      </div>
    </div>
  );
};

type Props = {
  nbPlaces: number;
  placesIndisponibles: number;
  placesVacantes: number;
  placesPIBPI: number;
  placesPIdeboutees: number;
};
