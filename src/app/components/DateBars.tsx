"use client";

import { ReactElement } from "react";
import { DateBar, DatePair } from "./DateBar";
import dayjs from "dayjs";

// TODO : delete this component and dayjs
export const DateBars = ({ datePairs }: Props): ReactElement => {
  const getTimeDifference = (datePair: DatePair): number => {
    return dayjs(datePair.endDate).diff(datePair.startDate, "day");
  };

  const getTimeDifferences = (datePairs: DatePair[]): number[] => {
    return datePairs.map(getTimeDifference);
  };

  const getTodayOffset = (datePairs: DatePair[]): number => {
    const timeDifferences = getTimeDifferences(datePairs);
    const maxDifference = Math.max(...timeDifferences);
    const dates = datePairs.flatMap((datePair) => [
      datePair.startDate,
      datePair.endDate,
    ]);
    const minDate = dates.sort(
      (firstDate, secondDate) =>
        new Date(firstDate).getTime() - new Date(secondDate).getTime()
    )[0];
    const todayDiff = dayjs(new Date()).diff(minDate, "day");
    return (todayDiff / maxDifference) * 100;
  };

  return (
    <div>
      <div className="d-flex">
        <div className="fr-col fr-col-2" />
        <div className="fr-col fr-col-8">
          <strong
            className="fr-text--xs text-grey uppercase"
            style={{
              marginLeft: `${getTodayOffset(datePairs)}%`,
            }}
          >
            Aujourd’hui
          </strong>
        </div>
      </div>
      {datePairs.map((datePair, index) => (
        <div key={index} className="d-flex">
          <div className="fr-col fr-col-2 align-right">
            <strong className="fr-pr-1w">{datePair.label}</strong>
          </div>
          <DateBar datePair={datePair} datePairs={datePairs} />
        </div>
      ))}
    </div>
  );
};

type Props = {
  datePairs: DatePair[];
};
