"use client";

import { ReactElement } from "react";

import PieChart from "@/app/components/common/PieChart";
import { getPercentage } from "@/app/utils/common.util";

export const ActivitePlaces = ({
  nbPlaces,
  placesIndisponibles,
  placesVacantes,
  presencesInduesBPI,
  presencesInduesDeboutees,
}: Props): ReactElement => {
  const pieChartOptions = {
    showLabel: false,
    donut: true,
    donutWidth: 30,
  };
  const placesDisponibles = nbPlaces - placesIndisponibles;
  const placesOccupees = placesDisponibles - placesVacantes;
  return (
    <div className="flex items-center pt-3">
      <div>
        <PieChart
          size={160}
          data={{
            labels: ["Places indisponibles", "Places disponibles"],
            series: [placesIndisponibles, nbPlaces - placesIndisponibles],
          }}
          options={pieChartOptions}
          colors={["green", "blue", "yellow"]}
          isDonut={true}
        >
          <div className="absolute w-22 top-13 left-26 text-sm text-center">
            <strong>{nbPlaces}</strong> places enregistrées DNA
          </div>
        </PieChart>
        <div className="pt-2 text-center">
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
      <span className="fr-icon-arrow-right-s-line text-title-blue-france fr-icon--lg" />
      <div>
        <PieChart
          size={160}
          data={{
            labels: ["Places vacantes", "Places non vacantes"],
            series: [placesVacantes, placesDisponibles - placesVacantes],
          }}
          options={pieChartOptions}
        >
          <div className="absolute w-22 top-15 left-26 text-sm text-center">
            <strong>{placesDisponibles}</strong> places disponibles
          </div>
        </PieChart>
        <div className="pt-2 text-center">
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
      <span className="fr-icon-arrow-right-s-line text-title-blue-france fr-icon--lg" />
      <div>
        <PieChart
          size={160}
          data={{
            labels: [
              "Places indues BPI",
              "Places indues déboutées",
              "Places non indues et non deboutées",
            ],
            series: [
              presencesInduesBPI,
              presencesInduesDeboutees,
              placesOccupees - presencesInduesBPI - presencesInduesDeboutees,
            ],
          }}
          options={pieChartOptions}
        >
          <div className="absolute w-22 top-15 left-26 text-sm text-center">
            <strong>{placesOccupees}</strong> places occupées
          </div>
        </PieChart>
        <div className="pt-2 text-center">
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
