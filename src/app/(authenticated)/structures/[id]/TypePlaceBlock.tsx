"use client";

import { ReactElement } from "react";
import { Block } from "@/app/components/common/Block";
import dynamic from "next/dynamic";
import { InformationCard } from "@/app/components/InformationCard";

const PieChart = dynamic(
  () => import("@codegouvfr/react-dsfr/Chart/PieChart"),
  {
    ssr: false,
  }
);
export const TypePlaceBlock = ({ placesAutorisees }: Props): ReactElement => {
  return (
    <Block title="Type de place" iconClass="fr-icon-map-pin-2-line">
      <InformationCard
        primaryInformation={placesAutorisees}
        secondaryInformation="places autorisées"
      />
      <PieChart x={[1, 2]} y={[2, 3]} />
    </Block>
  );
};

type Props = {
  placesAutorisees: number;
};
