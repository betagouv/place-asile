"use client";

import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router";
import dynamic from "next/dynamic";
import { ReactElement, useMemo, useState } from "react";

import Loader from "@/app/components/ui/Loader";
import { useFetchState } from "@/app/context/FetchStateContext";
import { useStructuresSearch } from "@/app/hooks/useStructuresSearch";
import { FetchState } from "@/types/fetch-state.type";

import { SegmentedControl } from "../../components/common/SegmentedControl";
import { SearchBar } from "./_components/SearchBar";
import { StructuresTable } from "./_components/StructuresTable";

export default function Structures(): ReactElement {
  const [selectedVisualization, setSelectedVisualization] = useState("tableau");

  const { structures, totalStructures } = useStructuresSearch({ map: false });

  const { getFetchState } = useFetchState();
  const fetchState = getFetchState("structure-search");

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
        <SearchBar />
        <p className="pl-3 text-mention-grey mb-0">
          {totalStructures} entrée
          {totalStructures > 1 ? "s" : ""}
        </p>
      </div>
      {selectedVisualization === "tableau" && (
        <>
          {fetchState === FetchState.LOADING && (
            <div className="flex items-center p-4">
              <Loader />
              <span className="pl-2">Chargement des structures...</span>
            </div>
          )}
          {fetchState === FetchState.ERROR && (
            <div className="flex items-center p-4">
              <span className="pl-2">
                Erreur lors de la récupération des structures
              </span>
            </div>
          )}
          {fetchState === FetchState.IDLE &&
            structures &&
            (structures?.length > 0 ? (
              <StructuresTable
                structures={structures}
                totalStructures={totalStructures}
                ariaLabelledBy="structures-titre"
              />
            ) : (
              <p className="p-2">
                Aucun résultat ne correspond à votre recherche
              </p>
            ))}
        </>
      )}
      {selectedVisualization === "carte" && <StructuresMap />}
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
