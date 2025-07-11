"use client";

import { ReactElement } from "react";
import { Block } from "@/app/components/common/Block";
import { InformationCard } from "@/app/components/InformationCard";
import { TypePlaceHistory } from "./TypePlaceHistory";
import { TypePlaceCharts } from "./TypePlaceCharts";

import { useStructureContext } from "../context/StructureClientContext";
import {
  getCurrentPlacesLogementsSociaux,
  getCurrentPlacesQpv,
} from "@/app/utils/structure.util";

export const DefaultTypePlaceBlock = (): ReactElement => {
  // TODO : Refac props from blocks to remove the props and pass them from context
  const { structure } = useStructureContext();

  const {
    nbPlaces: placesAutorisees,
    placesACreer,
    placesAFermer,
    echeancePlacesACreer,
    echeancePlacesAFermer,
  } = structure;

  return (
    <Block title="Type de places" iconClass="fr-icon-map-pin-2-line">
      <div className="flex">
        <div className="pr-4">
          <InformationCard
            primaryInformation={placesAutorisees}
            secondaryInformation="places autorisées"
          />
        </div>
        {echeancePlacesACreer && (
          <div className="pr-4">
            <InformationCard
              primaryInformation={`dont ${placesACreer}`}
              secondaryInformation={`places à créer au ${new Date(
                echeancePlacesACreer
              ).toLocaleDateString()}`}
            />
          </div>
        )}
        {echeancePlacesAFermer && (
          <InformationCard
            primaryInformation={`dont ${placesAFermer}`}
            secondaryInformation={`places à fermer au ${new Date(
              echeancePlacesAFermer
            ).toLocaleDateString()}`}
          />
        )}
      </div>
      <div className="pt-3 flex">
        <TypePlaceCharts
          placesAutorisees={placesAutorisees}
          placesPmr={structure?.structureTypologies?.[0]?.pmr || 0}
          placesLgbt={structure?.structureTypologies?.[0]?.lgbt || 0}
          placesFvvTeh={structure?.structureTypologies?.[0]?.fvvTeh || 0}
          placesQPV={getCurrentPlacesQpv(structure)}
          placesLogementsSociaux={getCurrentPlacesLogementsSociaux(structure)}
        />
      </div>
      <div className="pt-3">
        <TypePlaceHistory
          adresses={structure.adresses || []}
          structureTypologies={structure.structureTypologies || []}
        />
      </div>
    </Block>
  );
};
