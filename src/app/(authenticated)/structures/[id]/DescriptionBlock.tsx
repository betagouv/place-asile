import { Block } from "@/app/components/common/Block";
import { ReactElement } from "react";
import { RepartitionBadge } from "../RepartitionBadge";

export const DescriptionBlock = ({
  nbPlaces,
  repartition,
}: Props): ReactElement => {
  return (
    <Block title="Description" iconClass="fr-icon-menu-2-fill">
      <div className="fr-mb-1w">
        <strong className="fr-pr-2w">Nombre de places</strong>
        {nbPlaces || "Non renseigné"}
      </div>
      <div>
        <strong className="fr-pr-2w">Répartition</strong>
        <RepartitionBadge repartition={repartition} />
      </div>
    </Block>
  );
};

type Props = {
  nbPlaces: number;
  repartition: string;
};
