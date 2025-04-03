import { Block } from "@/app/components/common/Block";
import { Activite } from "@/types/activite.type";
import { ReactElement } from "react";
import { ActivityPlaces } from "./ActivityPlaces";

export const ActivityBlock = ({ activites }: Props): ReactElement => {
  return (
    <Block title="Activités" iconClass="fr-icon-team-line">
      <span className="text-blue-france">
        Données mensuelles mises à jour le{" "}
        {new Date(activites?.[0]?.date).toLocaleDateString()}
      </span>
      <ActivityPlaces />
    </Block>
  );
};

type Props = {
  activites: Activite[];
};
