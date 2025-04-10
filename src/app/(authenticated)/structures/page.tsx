"use client";

import dynamic from "next/dynamic";
import { ReactElement, useMemo, useState } from "react";
import { SegmentedControl } from "../../components/common/SegmentedControl";
import { useStructures } from "../../hooks/useStructures";
import { StructuresTable } from "./StructuresTable";

export default function Structures(): ReactElement {
  const structures = useStructures();
  const [selectedVisualization, setSelectedVisualization] = useState("carte");

  const StructuresMap = useMemo(
    () =>
      dynamic(() => import("./StructuresMap"), {
        loading: () => (
          <p className="h-full w-full flex items-center justify-center">
            Chargement de la carte en cours...
          </p>
        ),
        ssr: false,
      }),
    []
  );

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex justify-between fr-p-2w border-bottom">
        <SegmentedControl
          name="Visualisation"
          options={options}
          onChange={setSelectedVisualization}
        >
          <h2
            className="text-title-blue-france fr-h5 fr-mr-3w fr-mb-0"
            id="structures-titre"
          >
            Structures d’hébergement
          </h2>
        </SegmentedControl>
        <p className="text-mention-grey fr-mb-0">{structures.length} entrées</p>
      </div>
      {selectedVisualization === "carte" && (
        <StructuresMap structures={structures} />
      )}
      {selectedVisualization === "tableau" && (
        <StructuresTable
          structures={structures}
          ariaLabelledBy="structures-titre"
        />
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
