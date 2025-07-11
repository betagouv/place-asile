"use client";

import { ReactElement } from "react";
import { PieChart } from "@/app/components/common/PieChart";
import { getPercentage } from "@/app/utils/common.util";

export const ActivitesPlaces = ({
  nbPlaces,
  placesIndisponibles,
  placesVacantes,
  presencesInduesBPI,
  presencesInduesDeboutees,
}: Props): ReactElement => {
  const placesDisponibles = nbPlaces - placesIndisponibles;
  const placesOccupees = placesDisponibles - placesVacantes;
  return (
    <div className="flex items-center pt-3">
      <div>
        <PieChart
          x={[]}
          y={[placesIndisponibles, nbPlaces - placesIndisponibles]}
          color={["beige-gris-galet", "yellow-moutarde"]}
          width={350}
        />
        <div className="pt-2 text-center">
          <strong>{nbPlaces}</strong> places enregistrées DNA
          <div>
            <strong>{placesIndisponibles}</strong> indisponibles (
            {getPercentage(placesIndisponibles, nbPlaces)})
          </div>
          <div>
            <strong>{nbPlaces - placesIndisponibles}</strong> disponibles (
            {getPercentage(nbPlaces - placesIndisponibles, nbPlaces)})
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
        <div className="pt-2 text-center">
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
            presencesInduesBPI,
            presencesInduesDeboutees,
            placesOccupees - presencesInduesBPI - presencesInduesDeboutees,
          ]}
          color={["blue-france", "blue-ecume", "blue-cumulus"]}
          width={350}
        />
        <div className="pt-2 text-center">
          <strong>{placesOccupees}</strong> places occupées
          <div>
            <strong>{presencesInduesBPI}</strong> en présence indue BPI (
            {getPercentage(presencesInduesBPI, placesOccupees)})
          </div>
          <div>
            <strong>{presencesInduesDeboutees}</strong> en présence indue
            deboutée ({getPercentage(presencesInduesDeboutees, placesOccupees)})
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
  presencesInduesBPI: number;
  presencesInduesDeboutees: number;
};
