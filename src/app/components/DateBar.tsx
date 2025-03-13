"use client";

import { ReactElement, useEffect, useRef, useState } from "react";
import styles from "./DateBar.module.css";
import dayjs from "dayjs";

export const DateBar = ({ datePair, datePairs }: Props): ReactElement => {
  const [barWidth, setBarWidth] = useState(0);
  const [labelWidth, setLabelWidth] = useState(0);
  const dateBarRef = useRef<HTMLDivElement>(null);
  const startDateRef = useRef<HTMLDivElement>(null);
  const endDateRef = useRef<HTMLDivElement>(null);
  const timeBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      dateBarRef.current &&
      startDateRef.current &&
      endDateRef.current &&
      timeBarRef.current
    ) {
      setBarWidth(dateBarRef.current.offsetWidth);
      const startDateWidth = startDateRef.current.offsetWidth;
      const endDateWidth = endDateRef.current.offsetWidth;
      const timeBarWidth = timeBarRef.current.offsetWidth;
      setLabelWidth(startDateWidth + endDateWidth + timeBarWidth);
    }
  }, [setBarWidth, setLabelWidth, dateBarRef]);

  const getTimeDifference = (datePair: DatePair): number => {
    return dayjs(datePair.endDate).diff(datePair.startDate, "day");
  };

  const getTimeDifferences = (datePairs: DatePair[]): number[] => {
    return datePairs.map(getTimeDifference);
  };

  const getBarSize = (datePair: DatePair, datePairs: DatePair[]) => {
    const timeDifferences = getTimeDifferences(datePairs);
    const maxDifference = Math.max(...timeDifferences);
    return (getTimeDifference(datePair) / maxDifference) * 100;
  };

  const getBarOffset = (datePair: DatePair, datePairs: DatePair[]): number => {
    const timeDifferences = getTimeDifferences(datePairs);
    const dates = datePairs.flatMap((datePair) => [
      datePair.startDate,
      datePair.endDate,
    ]);
    const minDate = dates.sort(
      (firstDate, secondDate) =>
        new Date(firstDate).getTime() - new Date(secondDate).getTime()
    )[0];
    const currentDatePairDiff = dayjs(datePair.startDate).diff(minDate, "day");
    const maxDifference = Math.max(...timeDifferences);
    const elementWidthOffsetPercentage = (labelWidth / barWidth) * 100;
    const barOffsetPercentage = (currentDatePairDiff / maxDifference) * 100;
    return barOffsetPercentage === 0
      ? barOffsetPercentage
      : (currentDatePairDiff / maxDifference) * 100 -
          elementWidthOffsetPercentage;
  };

  return (
    <div
      className="fr-col fr-col-10 align-center"
      style={{
        marginLeft: `${getBarOffset(datePair, datePairs)}%`,
      }}
      ref={dateBarRef}
    >
      <span ref={startDateRef}>
        {new Date(datePair.startDate).toLocaleDateString()}
      </span>
      <div
        ref={timeBarRef}
        className={styles["date-bar"]}
        style={{
          width: `${getBarSize(datePair, datePairs)}%`,
        }}
      />
      <span ref={endDateRef}>
        {new Date(datePair.endDate).toLocaleDateString()}
      </span>
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
