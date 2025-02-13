"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { SegmentedControl } from "./components/common/SegmentedControl";
import { useCentres } from "./hooks/useCentres";
import { CentresTable } from "./components/CentresTable";

export default function Home() {
  const centres = useCentres();
  const [selectedVisualization, setSelectedVisualization] = useState("carte");

  const CentresMap = useMemo(
    () =>
      dynamic(() => import("./components/CentresMap"), {
        loading: () => <p>Chargement de la carte en cours...</p>,
        ssr: false,
      }),
    []
  );
  return (
    <>
      <div className="space-between fr-mb-1w">
        <SegmentedControl
          name="Visualisation"
          options={options}
          onChange={setSelectedVisualization}
        >
          <h1 className="text-blue-france fr-h3 fr-mr-3w fr-mb-0">Centres</h1>
        </SegmentedControl>
        <p className="text-grey fr-mb-0">{centres.length} entrées</p>
      </div>
      {selectedVisualization === "carte" && <CentresMap centres={centres} />}
      {selectedVisualization === "tableau" && (
        <CentresTable centres={centres} />
      )}
    </>
  );
}

const options = [
  {
    id: "carte",
    isChecked: true,
    label: "Carte",
    value: "carte",
    icon: "fr-icon-road-map-line",
  },
  {
    id: "tableau",
    isChecked: false,
    label: "Tableau",
    value: "tableau",
    icon: "fr-icon-survey-line",
  },
];
