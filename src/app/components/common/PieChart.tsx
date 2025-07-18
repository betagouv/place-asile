"use client";

import { useEffect, useRef } from "react";
import * as Chartist from "chartist";
import "chartist/dist/index.css";

let pieChartId = 0;

export default function PieChart({ data, options }: Props) {
  const chartRef = useRef(null);

  const idRef = useRef(++pieChartId);
  const chartClass = `piechart-${idRef.current}`;

  useEffect(() => {
    let chart = null;
    if (chartRef.current) {
      chart = new Chartist.PieChart(chartRef.current, data, options);
    }
    return () => {
      if (chart) {
        chart.detach();
      }
    };
  }, [data, options]);

  const getPieColors = () => {
    const colors = ["#FCC63A", "#C3992A", "#E5E5E5"];
    let css = `.${chartClass} .ct-series-a .ct-slice-pie { fill: ${colors[0]} !important; }`;
    if (data.series.length === 2) {
      css += `.${chartClass} .ct-series-b .ct-slice-pie { fill: ${colors[2]} !important; }`;
    } else if (data.series.length === 3) {
      css += `.${chartClass} .ct-series-b .ct-slice-pie { fill: ${colors[1]} !important; }
              .${chartClass} .ct-series-c .ct-slice-pie { fill: ${colors[2]} !important; }`;
    }
    return css;
  };

  return (
    <div className={chartClass}>
      <div ref={chartRef} style={{ height: 60 }} />
      <style>{getPieColors()}</style>
    </div>
  );
}

type Props = {
  data: Chartist.PieChartData;
  options: Chartist.PieChartOptions;
};
