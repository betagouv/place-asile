"use client";

import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router";
import dynamic from "next/dynamic";
import { ReactElement, useEffect, useMemo, useState } from "react";

import Loader from "@/app/components/ui/Loader";
import { StructureApiType } from "@/schemas/api/structure.schema";

import { SegmentedControl } from "../../components/common/SegmentedControl";
import { useStructures } from "../../hooks/useStructures";
import { SearchBar } from "./_components/SearchBar";
import { StructuresTable } from "./_components/StructuresTable";

export default function Structures(): ReactElement {
  const [structures, setStructures] = useState<StructureApiType[]>([]);
  const [loadingState, setLoadingState] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");
  const { getStructures } = useStructures();
  const [selectedVisualization, setSelectedVisualization] = useState("tableau");

  useEffect(() => {
    const loadStructures = async () => {
      setLoadingState("loading");
      const result = await getStructures();
      setStructures(result);
      setFilteredStructures(result);
      setLoadingState("loaded");
    };
    loadStructures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const StructuresMap = useMemo(
    () =>
      dynamic(() => import("./_components/StructuresMap"), {
        loading: () => (
          <p className="h-full w-full flex items-center justify-center">
            Chargement de la carte en cours...
          </p>
        ),
        ssr: false,
      }),
    []
  );

  const [filteredStructures, setFilteredStructures] = useState(structures);

  return (
    <div className="h-screen w-full flex flex-col">
      <StartDsfrOnHydration />
      <div className="flex fr-p-2w border-b border-b-border-default-grey min-h-[4.35rem] items-center">
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
        <div className="grow" />
        <SearchBar
          structures={structures}
          setFilteredStructures={setFilteredStructures}
        />
        <p className="pl-3 text-mention-grey mb-0">
          {filteredStructures.length} entrée
          {filteredStructures.length > 1 ? "s" : ""}
        </p>
      </div>
      {selectedVisualization === "tableau" && (
        <>
          {loadingState === "loading" && (
            <div className="flex items-center p-4">
              <Loader />
              <span className="pl-2">Chargement des structures...</span>
            </div>
          )}
          {loadingState === "error" && (
            <div className="flex items-center p-4">
              <span className="pl-2">
                Erreur lors de la récupération des structures
              </span>
            </div>
          )}
          {loadingState === "loaded" &&
            (filteredStructures.length > 0 ? (
              <StructuresTable
                structures={filteredStructures}
                ariaLabelledBy="structures-titre"
              />
            ) : (
              <p className="p-2">
                Aucun résultat ne correspond à votre recherche
              </p>
            ))}
        </>
      )}
      {selectedVisualization === "carte" && (
        <StructuresMap structures={filteredStructures} />
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
