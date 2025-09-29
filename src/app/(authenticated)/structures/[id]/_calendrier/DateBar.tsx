"use client";

import dayjs from "dayjs";
import { ReactElement } from "react";

import { Badge } from "@/app/components/common/Badge";

import styles from "./DateBar.module.css";

export const DateBar = ({ datePair }: Props): ReactElement => {
  /**
   * Calculates the percentage of time elapsed between startDate and endDate as of today.
   * @param {Date} startDate - The start date of the period.
   * @param {Date} endDate - The end date of the period.
   * @returns {number} - The percentage of time elapsed (0 to 100).
   */
  const getElapsedPercentage = ({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }): number => {
    const now = dayjs();
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    console.log("now", now);
    console.log("start", start);
    console.log("end", end);

    if (now.isBefore(start)) return 0;
    if (now.isAfter(end)) return 100;

    const total = end.diff(start, "millisecond");
    const elapsed = now.diff(start, "millisecond");

    if (total === 0) return 100;

    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };
  const isLessThan3Months = dayjs(datePair.endDate).diff(dayjs(), "month") < 3;
  const isConventionExpiree = dayjs(datePair.endDate).isBefore(dayjs());

  return (
    <>
      <div className="flex-1 flex items-center">
        <span className={styles.date}>
          {new Date(datePair.startDate).toLocaleDateString("fr-FR")}
        </span>
        <div className={styles["date-bar"]}>
          <div
            className={styles.done}
            style={{ width: `${getElapsedPercentage(datePair)}%` }}
          />
        </div>
      </div>
      <div className="w-64 flex items-center">
        <span className={styles.date}>
          {new Date(datePair.endDate).toLocaleDateString("fr-FR")}
        </span>
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
    </>
  );
};

type Props = {
  datePair: DatePair;
};

export type DatePair = {
  startDate: Date;
  endDate: Date;
  label: string;
};
