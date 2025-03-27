"use client";

import { Block } from "@/app/components/common/Block";
import { ReactElement } from "react";
import dynamic from "next/dynamic";

const PieChart = dynamic(
  () => import("@codegouvfr/react-dsfr/Chart/PieChart"),
  {
    ssr: false,
  }
);

export const TypePlaceBlock = (): ReactElement => {
  return (
    <Block title="Type de place" iconClass="fr-icon-map-pin-2-line">
      <PieChart x={[1, 2]} y={[2, 3]} />
    </Block>
  );
};
