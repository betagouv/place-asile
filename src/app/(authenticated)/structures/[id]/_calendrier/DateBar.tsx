"use client";

import dayjs from "dayjs";
import { ReactElement } from "react";

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

  const isLessThan3Months = dayjs(datePair.endDate).diff(dayjs(), "month") < 3;
  const isConventionExpiree = dayjs(datePair.endDate).isBefore(dayjs());

  return (
    <div className="fr-col fr-col-10 flex items-center">
      <span
        style={{
          display: "inline-block",
          width: "6rem",
          flexShrink: 0,
        }}
      >
        {new Date(datePair.startDate).toLocaleDateString()}
      </span>
      <div className={styles["initial-offset"]}></div>
      <div
        className={styles["date-bar"]}
        style={{
          width: `${getBarSize(datePair, datePairs)}%`,
        }}
      />
      <span>{new Date(datePair.endDate).toLocaleDateString()}</span>
      {!isConventionExpiree && isLessThan3Months && (
        <div className="pl-2">
          <Badge type="warning" icon={true}>
            {"<"}&nbsp;3&nbsp;mois
          </Badge>
        </div>
      )}
      {isConventionExpiree && (
        <div className="pl-2">
          <Badge type="warning" icon={true}>
            Convention&nbsp;expirée
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
