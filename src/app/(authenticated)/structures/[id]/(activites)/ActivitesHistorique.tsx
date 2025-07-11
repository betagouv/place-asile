"use client";

import { ReactElement, useState } from "react";
import { Activite } from "@/types/activite.type";
import { ActivitesDurations } from "./ActivitesDurations";
import { MultiLineChart } from "@/app/components/common/MultiLineChart";
import { formatForCharts, getMonthsBetween } from "@/app/utils/date.util";
import { ActivitesTypes } from "./ActivitesTypes";
import dayjs from "dayjs";
import { computeAverage } from "@/app/utils/common.util";

const typesActivite: Partial<
  Record<keyof Activite, { label: string; seuil: number | null }>
> = {
  presencesInduesBPI: { label: "Présences indues BPI", seuil: 3 },
  presencesInduesDeboutees: { label: "Présences indues déboutées", seuil: 4 },
  // TODO : update "seuil" to real values
  presencesIndues: { label: "Présences indues totales", seuil: 3 },
  placesVacantes: { label: "Places vacantes", seuil: 3 },
  placesIndisponibles: { label: "Places indisponibles", seuil: 3 },
  nbPlaces: { label: "Places totales", seuil: null },
};

export const ActivitesHistorique = ({
  activites,
  debutConvention,
  finConvention,
}: Props): ReactElement => {
  const [selectedMonths, setSelectedMonths] = useState<dayjs.Dayjs[]>(
    getMonthsBetween(debutConvention, finConvention)
  );
  const [typeActivite, setTypeActivite] =
    useState<keyof Activite>("presencesInduesBPI");

  const getCurrentActivite = (
    activites: Activite[],
    date: dayjs.Dayjs
  ): Activite | undefined => {
    return activites.find((activite) => {
      const isSameMonth =
        new Date(activite.date)?.getMonth() === date.get("month");
      const isSameYear =
        new Date(activite.date)?.getFullYear() === date.get("year");
      return isSameMonth && isSameYear;
    });
  };

  const getActivitesData = (): number[] => {
    return selectedMonths.map((selectedMonth) => {
      const currentActivite = getCurrentActivite(activites, selectedMonth);
      if (currentActivite) {
        return currentActivite?.[typeActivite] as number;
      }
      return 0;
    });
  };

  const getSeuilRecommande = (): number[] => {
    const currentActivites: (Activite | undefined)[] = selectedMonths.map(
      (selectedMonth) => {
        return getCurrentActivite(activites, selectedMonth);
      }
    );
    return currentActivites.map((activite) => {
      const seuilRecommande = typesActivite[typeActivite]?.seuil || 0;
      return (seuilRecommande * (activite?.nbPlaces || 0)) / 100;
    });
  };

  const getAverage = (): number[] => {
    const activitesData = getActivitesData();
    const average = computeAverage(activitesData);
    return Array(selectedMonths.length).fill(average);
  };

  return (
    <div>
      <h4 className="text-lg text-title-blue-france">Historique</h4>
      <div className="flex pb-5">
        <ActivitesTypes
          typeActivite={typeActivite}
          setTypeActivite={setTypeActivite}
        />
      </div>
      <div className="pb-5">
        <ActivitesDurations
          setSelectedMonths={setSelectedMonths}
          debutConvention={debutConvention}
          finConvention={finConvention}
        />
      </div>
      <div className="flex">
        <MultiLineChart
          width={800}
          x={[selectedMonths.map(formatForCharts)]}
          y={[getActivitesData(), getSeuilRecommande(), getAverage()]}
          color={["blue-cumulus", "blue-ecume", "green-bourgeon"]}
        />
        <div className="pl-5">
          <div className="pb-1 flex items-center">
            <div className="w-[40px] h-[2px] bg-flat-blue-cumulus mr-2" />
            {typesActivite[typeActivite]?.label}
          </div>
          <div className="pb-1 flex items-center">
            <div className="w-[40px] h-[2px] bg-flat-blue-ecume mr-2" />
            Seuil recommandé
          </div>
          <div className="pb-1 flex items-center">
            <div className="w-[40px] h-[2px] bg-flat-green-bourgeon mr-2" />
            Moyenne sur la période
          </div>
        </div>
      </div>
    </div>
  );
};

type Props = {
  activites: Activite[];
  debutConvention: Date | null;
  finConvention: Date | null;
};
