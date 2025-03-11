import { ReactElement } from "react";
import styles from "./DateBars.module.css";
import dayjs from "dayjs";

export const DateBars = ({ datePairs }: Props): ReactElement => {
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

  return (
    <div>
      {datePairs.map((datePair, index) => (
        <div key={index} className="d-flex">
          <div className="fr-col fr-col-2 align-right">
            <strong className="fr-pr-1w">{datePair.label}</strong>
          </div>
          <div className="fr-col fr-col-10 d-flex align-center">
            {new Date(datePair.startDate).toLocaleDateString()}
            <div
              className={styles["date-bar"]}
              style={{ width: `${getBarSize(datePair, datePairs)}%` }}
            />
            {new Date(datePair.endDate).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

type Props = {
  datePairs: DatePair[];
};

type DatePair = {
  startDate: Date;
  endDate: Date;
  label: string;
};
