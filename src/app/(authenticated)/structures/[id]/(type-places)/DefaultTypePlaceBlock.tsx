"use client";

import { ReactElement } from "react";
import { Block } from "@/app/components/common/Block";
import { InformationCard } from "@/app/components/InformationCard";
import { TypePlaceHistory } from "./TypePlaceHistory";
import { TypePlaceCharts } from "./TypePlaceCharts";
import { Adresse } from "@/types/adresse.type";
import { StructureTypologie } from "@/types/structure-typologie.type";

export const DefaultTypePlaceBlock = ({
  placesAutorisees,
  placesACreer,
  placesAFermer,
  placesPmr,
  placesLgbt,
  placesFvvTeh,
  placesQPV,
  placesLogementsSociaux,
  echeancePlacesACreer,
  echeancePlacesAFermer,
  adresses,
  structureTypologies,
}: Props): ReactElement => {
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
          placesPmr={placesPmr}
          placesLgbt={placesLgbt}
          placesFvvTeh={placesFvvTeh}
          placesQPV={placesQPV}
          placesLogementsSociaux={placesLogementsSociaux}
        />
      </div>
      <div className="fr-pt-3w">
        <TypePlaceHistory
          adresses={adresses}
          structureTypologies={structureTypologies}
        />
      </div>
    </Block>
  );
};

type Props = {
  placesAutorisees: number;
  placesACreer: number | null;
  placesAFermer: number | null;
  placesPmr: number;
  placesLgbt: number;
  placesFvvTeh: number;
  placesQPV: number;
  placesLogementsSociaux: number;
  echeancePlacesACreer: Date | null;
  echeancePlacesAFermer: Date | null;
  adresses: Adresse[];
  structureTypologies: StructureTypologie[];
};
