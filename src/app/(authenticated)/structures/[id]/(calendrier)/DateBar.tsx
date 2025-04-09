"use client";

import { ReactElement } from "react";
import dayjs from "dayjs";
import { Badge } from "@/app/components/common/Badge";
import styles from "./DateBar.module.css";

export const DateBar = ({ datePair, datePairs }: Props): ReactElement => {
  const getTimeDifference = (datePair: DatePair): number => {
    return dayjs(datePair.endDate).diff(dayjs(), "day");
  };

  const getTimeDifferences = (datePairs: DatePair[]): number[] => {
    return datePairs.map(getTimeDifference);
  };

  const getBarSize = (datePair: DatePair, datePairs: DatePair[]) => {
    const timeDifferences = getTimeDifferences(datePairs);
    const maxDifference = Math.max(...timeDifferences);
    return (getTimeDifference(datePair) / maxDifference) * 100;
  };

  const isWarningDisplayed = dayjs(datePair.endDate).diff(dayjs(), "month") < 3;

  return (
    <div className="fr-col fr-col-10 flex items-center">
      <span>{new Date(datePair.startDate).toLocaleDateString()}</span>
      <div className={styles["initial-offset"]}></div>
      <div
        className={styles["date-bar"]}
        style={{
          width: `${getBarSize(datePair, datePairs)}%`,
        }}
      />
      <span>{new Date(datePair.endDate).toLocaleDateString()}</span>
      {isWarningDisplayed && (
        <div className="fr-pl-1w">
          <Badge type="warning" icon={true}>
            {"<"} 3 mois
          </Badge>
        </div>
      )}
    </div>
  );
};

type Props = {
  datePair: DatePair;
  datePairs: DatePair[];
};

export type DatePair = {
  startDate: Date;
  endDate: Date;
  label: string;
};
