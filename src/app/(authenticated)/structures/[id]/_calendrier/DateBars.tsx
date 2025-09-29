"use client";

import { ReactElement } from "react";

import { DateBar, DatePair } from "./DateBar";

export const DateBars = ({ datePairs }: Props): ReactElement => {
  return (
    <div>
      {datePairs.map((datePair, index) => (
        <div key={index} className="flex">
          <div className="w-48 flex justify-end">
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
