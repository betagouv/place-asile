import { PropsWithChildren } from "react";

export const Badge = ({ children }: PropsWithChildren) => {
  return (
    <p className="fr-badge fr-badge--success fr-badge--no-icon fr-badge--sm fr-m-0">
      {children}
    </p>
  );
};
