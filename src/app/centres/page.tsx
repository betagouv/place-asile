"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { SegmentedControl } from "../components/SegmentedControl";
import { useCentres } from "../hooks/useCentres";
import { CentresTable } from "./CentresTable";

export default function Centres() {
  const centres = useCentres();
  const [selectedVisualization, setSelectedVisualization] = useState("carte");

  const CentresMap = useMemo(
    () =>
      dynamic(() => import("./CentresMap"), {
        loading: () => <p>Chargement de la carte en cours...</p>,
        ssr: false,
      }),
    []
  );

  return (
    <div className="w-full">
      <div className="space-between fr-py-1w fr-px-2w border-bottom">
        <SegmentedControl
          name="Visualisation"
          options={options}
          onChange={setSelectedVisualization}
        >
          <h2
            className="text-blue-france fr-h3 fr-mr-3w fr-mb-0"
            id="centres-titre"
          >
            Centres
          </h2>
        </SegmentedControl>
        <p className="text-grey fr-mb-0">{centres.length} entrées</p>
      </div>
      {selectedVisualization === "carte" && <CentresMap centres={centres} />}
      {selectedVisualization === "tableau" && (
        <CentresTable centres={centres} ariaLabelledBy="centres-titre" />
      )}
    </div>
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
