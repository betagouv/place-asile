import { PropsWithChildren } from "react";

export const Badge = ({ children, type }: Props) => {
  const getTypeClass = (type: BadgeType | undefined): string => {
    if (!type) {
      return "fr-badge--success";
    }
    const types = {
      success: "fr-badge--success",
      info: "fr-badge--info",
    };
    return types[type];
  };
  return (
    <p
      className={`fr-badge ${getTypeClass(
        type
      )} fr-badge--no-icon fr-badge--sm fr-m-0`}
    >
      {children}
    </p>
  );
};

type Props = PropsWithChildren<{
  type?: BadgeType;
}>;

export type BadgeType = "success" | "info";
