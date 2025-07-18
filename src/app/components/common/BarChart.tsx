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

  // TODO : use real DSFR colors
  return (
    <>
      <div ref={chartRef} style={{ height: 300 }} />
      <style>
        {`
          .ct-series-a .ct-slice-pie { fill: #FCC63A !important; }
          .ct-series-b .ct-slice-pie { fill: #C3992A !important; }
          .ct-series-c .ct-slice-pie { fill: #FBB8F6 !important; }
          .ct-series-d .ct-slice-pie { fill: #B6CFFB !important; }
        `}
      </style>
    </>
  );
}

type Props = {
  data: Chartist.BarChartData;
  options: Chartist.BarChartOptions;
};
