import { Block } from "@/app/components/common/Block";
import { InformationCard } from "@/app/components/InformationCard";
import { ReactElement } from "react";
import { PieChart } from "@/app/components/common/PieChart";

export const TypePlaceBlock = ({ placesAutorisees }: Props): ReactElement => {
  return (
    <Block title="Type de place" iconClass="fr-icon-map-pin-2-line">
      <InformationCard
        primaryInformation={placesAutorisees}
        secondaryInformation="places autorisées"
      />
      <PieChart />
    </Block>
  );
};

type Props = {
  placesAutorisees: number;
};
