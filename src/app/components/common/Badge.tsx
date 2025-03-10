import { PropsWithChildren, ReactElement } from "react";

export const Badge = ({ children, type }: Props): ReactElement => {
  const getTypeClass = (type: BadgeType | undefined): string => {
    if (!type) {
      return "fr-badge--success";
    }
    const types = {
      success: "fr-badge--success",
      info: "fr-badge--info",
      error: "fr-badge--error",
      warning: "fr-badge--warning",
      new: "fr-badge--new",
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

export type BadgeType = "success" | "info" | "error" | "warning" | "new";
