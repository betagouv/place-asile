import { Block } from "@/app/components/common/Block";
import { ReactElement } from "react";
import { TypologieBadge } from "../TypologieBadge";

export const DescriptionBlock = ({
  nbPlaces,
  nbHebergements,
  typologie,
}: Props): ReactElement => {
  return (
    <Block title="Description" iconClass="fr-icon-menu-2-fill">
      <div className="fr-mb-1w">
        <strong className="fr-pr-2w">Nombre de places</strong>
        {nbPlaces || "Non renseigné"}
      </div>
      <div className="fr-mb-1w">
        <strong className="fr-pr-2w">Nombre d’hébergements</strong>
        {nbHebergements || "Non renseigné"}
      </div>
      <div>
        <strong className="fr-pr-2w">Répartition</strong>
        <TypologieBadge typologie={typologie} />
      </div>
    </Block>
  );
};

type Props = {
  nbPlaces: number;
  nbHebergements: number;
  typologie: string;
};
