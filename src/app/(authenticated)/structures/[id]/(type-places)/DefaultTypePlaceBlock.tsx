"use client";

import { ReactElement } from "react";
import { Block } from "@/app/components/common/Block";
import { InformationCard } from "@/app/components/InformationCard";
import { TypePlaceHistory } from "./TypePlaceHistory";
import { TypePlaceCharts } from "./TypePlaceCharts";

import { useStructureContext } from "../context/StructureContext";
import {
  getCurrentPlacesLogementsSociaux,
  getCurrentPlacesQpv,
} from "@/app/utils/structure.util";

export const DefaultTypePlaceBlock = (): ReactElement => {
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
        <div className="fr-pr-2w">
          <InformationCard
            primaryInformation={placesAutorisees}
            secondaryInformation="places autorisées"
          />
        </div>
        {echeancePlacesACreer && (
          <div className="fr-pr-2w">
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
      <div className="fr-pt-3w flex">
        <TypePlaceCharts
          placesAutorisees={placesAutorisees}
          placesPmr={structure?.typologies?.[0]?.pmr || 0}
          placesLgbt={structure?.typologies?.[0]?.lgbt || 0}
          placesFvvTeh={structure?.typologies?.[0]?.fvvTeh || 0}
          placesQPV={getCurrentPlacesQpv(structure)}
          placesLogementsSociaux={getCurrentPlacesLogementsSociaux(structure)}
        />
      </div>
      <div className="fr-pt-3w">
        <TypePlaceHistory
          adresses={structure.adresses || []}
          structureTypologies={structure.typologies || []}
        />
      </div>
    </Block>
  );
};
