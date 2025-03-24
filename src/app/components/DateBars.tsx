"use client";

import { ReactElement } from "react";
import { DateBar, DatePair } from "./DateBar";
import styles from "./DateBar.module.css";

export const DateBars = ({ datePairs }: Props): ReactElement => {
  return (
    <div>
      <div className="d-flex">
        <div className="fr-col fr-col-2" />
        <div className="fr-col fr-col-8">
          <strong className={`fr-text--xs text-grey uppercase ${styles.today}`}>
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
