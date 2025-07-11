"use client";

import dynamic from "next/dynamic";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { SegmentedControl } from "../../components/common/SegmentedControl";
import { useStructures } from "../../hooks/useStructures";
import { StructuresTable } from "./StructuresTable";
import { Structure } from "@/types/structure.type";

export default function Structures(): ReactElement {
  const [structures, setStructures] = useState<Structure[]>([]);
  const { getStructures } = useStructures();
  const [selectedVisualization, setSelectedVisualization] = useState("tableau");

  useEffect(() => {
    const loadStructures = async () => {
      const result = await getStructures();
      setStructures(result);
    };
    loadStructures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            className="text-title-blue-france fr-h5 mr-4 mb-0"
            id="structures-titre"
          >
            Structures d’hébergement
          </h2>
        </SegmentedControl>
        <p className="text-mention-grey mb-0">{structures.length} entrées</p>
      </div>
      {selectedVisualization === "tableau" && (
        <StructuresTable
          structures={structures}
          ariaLabelledBy="structures-titre"
        />
      )}
      {selectedVisualization === "carte" && (
        <StructuresMap structures={structures} />
      )}
    </div>
  );
}

const options = [
  {
    id: "tableau",
    isChecked: true,
    label: "Tableau",
    value: "tableau",
    icon: "fr-icon-survey-line",
  },
  {
    id: "carte",
    isChecked: false,
    label: "Carte",
    value: "carte",
    icon: "fr-icon-road-map-line",
  },
];
