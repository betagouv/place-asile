"use client";

import dynamic from "next/dynamic";
import "@gouvfr/dsfr/dist/dsfr.module.min.js";
// import "@gouvfr/dsfr-chart/dist/DSFRChart/DSFRChart.js";
// import "@gouvfr/dsfr-chart/dist/DSFRChart/DSFRChart.css";

export const PieChart = dynamic(
  () => import("@gouvfr/dsfr-chart/dist/DSFRChart/DSFRChart.js"),
  {
    ssr: false,
  }
);
