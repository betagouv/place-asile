import { ReactElement } from "react";
import { Badge, BadgeType } from "../components/Badge";

export const TypologieBadge = ({ typologie }: Props): ReactElement => {
  const getBadgeType = (typologie: string): BadgeType => {
    return typologie === "Diffus" ? "success" : "info";
  };
  return <Badge type={getBadgeType(typologie)}>{typologie}</Badge>;
};

type Props = {
  typologie: string;
};
