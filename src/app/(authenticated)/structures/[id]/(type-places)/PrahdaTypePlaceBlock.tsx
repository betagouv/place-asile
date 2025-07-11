"use client";

import { ReactElement } from "react";
import { Block } from "@/app/components/common/Block";
import { InformationCard } from "@/app/components/InformationCard";
import { useStructureContext } from "../context/StructureClientContext";

export const PrahdaTypePlaceBlock = (): ReactElement => {
  // TODO : Refac props from blocks to remove the props and pass them from context
  const { structure } = useStructureContext();

  return (
    <Block title="Type de places" iconClass="fr-icon-map-pin-2-line">
      <InformationCard
        primaryInformation={structure.nbPlaces}
        secondaryInformation="places autorisées"
      />
    </Block>
  );
};
