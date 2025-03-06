import { ReactElement } from "react";
import { Badge, BadgeType } from "../../components/common/Badge";

export const RepartitionBadge = ({ repartition }: Props): ReactElement => {
  const getBadgeType = (repartition: string): BadgeType => {
    return repartition === "Diffus" ? "success" : "info";
  };
  return <Badge type={getBadgeType(repartition)}>{repartition}</Badge>;
};

type Props = {
  repartition: string;
};
