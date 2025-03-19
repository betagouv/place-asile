import { ReactElement } from "react";
import { Badge, BadgeType } from "../../components/common/Badge";
import { Repartition } from "@/types/adresse.type";

export const RepartitionBadge = ({ repartition }: Props): ReactElement => {
  const getBadgeType = (repartition: string): BadgeType => {
    return repartition === Repartition.DIFFUS ? "success" : "info";
  };
  return <Badge type={getBadgeType(repartition)}>{repartition}</Badge>;
};

type Props = {
  repartition: Repartition;
};
