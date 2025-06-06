import { ReactElement } from "react";
import { Badge, BadgeType } from "../../components/common/Badge";
import { Repartition } from "@/types/adresse.type";

export const RepartitionBadge = ({ repartition }: Props): ReactElement => {
  const getBadgeType = (repartition: Repartition): BadgeType => {
    const typesByRepartition: Record<Repartition, BadgeType> = {
      [Repartition.DIFFUS]: "new",
      [Repartition.COLLECTIF]: "info",
      [Repartition.MIXTE]: "warning",
    };
    return typesByRepartition[repartition];
  };
  return <Badge type={getBadgeType(repartition)}>{repartition}</Badge>;
};

type Props = {
  repartition: Repartition;
};
