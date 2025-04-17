"use client";

import { ReactElement } from "react";
import { Block } from "@/app/components/common/Block";
import { InformationCard } from "@/app/components/InformationCard";

export const PrahdaTypePlaceBlock = ({
  placesAutorisees,
}: Props): ReactElement => {
  return (
    <Block title="Type de places" iconClass="fr-icon-map-pin-2-line">
      <InformationCard
        primaryInformation={placesAutorisees}
        secondaryInformation="places autorisées"
      />
    </Block>
  );
};

type Props = {
  placesAutorisees: number;
};
