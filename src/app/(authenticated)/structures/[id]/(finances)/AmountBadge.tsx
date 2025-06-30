import { Badge } from "@/app/components/common/Badge";
import { ReactElement } from "react";

export const AmountBadge = ({ amount }: Props): ReactElement => {
  if (!amount || amount === 0) {
    return <></>;
  }
  return amount > 0 ? (
    <Badge type="success">Excédent</Badge>
  ) : (
    <Badge type="error">Déficit</Badge>
  );
};

type Props = {
  amount: number | null;
};
