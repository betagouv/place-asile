"use client";

import "chartist/dist/index.css";

import * as Chartist from "chartist";
import { useEffect, useId, useRef } from "react";

export default function LineChart({ data, options, height = 350 }: Props) {
  const chartRef = useRef(null);
  const id = useId();
  const chartClass = `linechart-${id.replace(/:/g, "-")}`;

  useEffect(() => {
    let chart = null;
    if (chartRef.current) {
      chart = new Chartist.LineChart(chartRef.current, data, {
        ...options,
        lineSmooth: false,
      });
    }
    return () => {
      if (chart) {
        chart.detach();
      }
    };
  }, [data, options]);

  return (
    <div className={`w-full ${chartClass}`}>
      <div ref={chartRef} style={{ height }} />
      <style>
        {`
          .${chartClass} .ct-series-a .ct-point { stroke: var(--blue-cumulus-sun-368-moon-732) !important; }
          .${chartClass} .ct-series-a .ct-line { stroke: var(--blue-cumulus-sun-368-moon-732) !important; }
          .${chartClass} .ct-series-a .ct-line { stroke-width: 2px !important; }
          .${chartClass} .ct-series-b .ct-point { display: none !important; }
          .${chartClass} .ct-series-b .ct-line { stroke: var(--blue-ecume-sun-247-moon-675) !important; }
          .${chartClass} .ct-series-b .ct-line { stroke-width: 2px !important; }
          .${chartClass} .ct-series-b .ct-line { stroke-dasharray: 10,10 !important; }
          .${chartClass} .ct-series-c .ct-point { display: none !important; }
          .${chartClass} .ct-series-c .ct-line { stroke: var(--green-bourgeon-sun-425-moon-759) !important; }
          .${chartClass} .ct-series-c .ct-line { stroke-width: 2px !important; }
          .${chartClass} .ct-series-c .ct-line { stroke-dasharray: 5,5 !important; }
        `}
      </style>
    </div>
  );
}

type Props = {
  data: Chartist.LineChartData;
  options: Chartist.LineChartOptions;
  height?: number;
};
