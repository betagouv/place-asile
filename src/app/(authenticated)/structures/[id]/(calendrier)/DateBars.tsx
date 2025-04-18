"use client";

import { ReactElement } from "react";
import { DateBar, DatePair } from "./DateBar";
import styles from "./DateBar.module.css";

export const DateBars = ({ datePairs }: Props): ReactElement => {
  return (
    <div>
      <div className="flex">
        <div className="fr-col fr-col-2" />
        <div className="fr-col fr-col-8">
          <strong
            className={`fr-text--xs text-mention-grey uppercase ${styles.today}`}
          >
            Aujourd’hui
            <span style={{ height: `${datePairs.length * 1.5}rem` }}></span>
          </strong>
        </div>
      </div>
      {datePairs.map((datePair, index) => (
        <div key={index} className="flex">
          <div className="fr-col fr-col-2 flex justify-end">
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
