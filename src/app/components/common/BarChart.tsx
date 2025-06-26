"use client";

import { useEffect, useRef } from "react";
import * as Chartist from "chartist";
import "chartist/dist/index.css";

// TODO : corriger les erreurs de réhydratation de ce composant
export default function BarChart({ data, options }: Props) {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart = null;
    if (chartRef.current) {
      chart = new Chartist.BarChart(chartRef.current, data, options);
    }
    return () => {
      if (chart) {
        chart.detach();
      }
    };
  }, [data, options]);

  return <div ref={chartRef} style={{ height: 300 }} />;
}

type Props = {
  data: Chartist.BarChartData;
  options: Chartist.BarChartOptions;
};
