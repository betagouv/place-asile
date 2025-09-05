"use client";

import { ReactElement } from "react";

import { Block } from "@/app/components/common/Block";
import { InformationCard } from "@/app/components/InformationCard";
import {
  getCurrentPlacesLogementsSociaux,
  getCurrentPlacesQpv,
} from "@/app/utils/structure.util";

import { useStructureContext } from "../context/StructureClientContext";
import { TypePlaceCharts } from "./TypePlaceCharts";
import { TypePlaceHistory } from "./TypePlaceHistory";

export const DefaultTypePlaceBlock = (): ReactElement => {
  const { structure } = useStructureContext();

  const {
    placesACreer,
    placesAFermer,
    echeancePlacesACreer,
    echeancePlacesAFermer,
    structureTypologies,
    adresses,
  } = structure;

  return (
    <Block title="Type de places" iconClass="fr-icon-map-pin-2-line">
      <div className="flex">
        <div className="pr-4">
          <InformationCard
            primaryInformation={structureTypologies?.[0].placesAutorisees || "N/A"}
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
          placesAutorisees={structureTypologies?.[0]?.placesAutorisees || 0}
          placesPmr={structureTypologies?.[0]?.pmr || 0}
          placesLgbt={structureTypologies?.[0]?.lgbt || 0}
          placesFvvTeh={structureTypologies?.[0]?.fvvTeh || 0}
          placesQPV={getCurrentPlacesQpv(structure)}
          placesLogementsSociaux={getCurrentPlacesLogementsSociaux(structure)}
        />
      </div>
      <div className="pt-3">
        <TypePlaceHistory
          adresses={adresses || []}
          structureTypologies={structureTypologies || []}
        />
      </div>
    </Block>
  );
};
