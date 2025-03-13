"use client";

import { ReactElement } from "react";
import { Chart } from "react-google-charts";

export const Timeline = ({ datePairs }: Props): ReactElement => {
  const columns = [
    { type: "string", id: "Nom" },
    { type: "string", id: "Dates" },
    { type: "date", id: "Début" },
    { type: "date", id: "Fin" },
  ];

  const rows = datePairs.map((datePair) => {
    return [
      datePair.label,
      `${new Date(datePair.startDate).toLocaleDateString()} - ${new Date(
        datePair.endDate
      ).toLocaleDateString()}`,
      new Date(datePair.startDate),
      new Date(datePair.endDate),
    ];
  });

  const data = [columns, ...rows];

  const options = {
    timeline: { singleColor: "#6A6AF4" },
    alternatingRowStyle: false,
    enableInteractivity: false,
    height: 180,
  };

  return <Chart chartType="Timeline" data={data} options={options} />;
};

type Props = {
  datePairs: DatePair[];
};

type DatePair = {
  startDate: Date;
  endDate: Date;
  label: string;
};
