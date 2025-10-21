import Tag from "@codegouvfr/react-dsfr/Tag";
import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "@/app/utils/classname.util";

export const Tab = ({ title, route, current, type }: Props) => {
  return (
    <Link
      href={route}
      className={cn(
        "h-full flex flex-col justify-between py-3 pr-3 pl-5 border-default-grey border rounded-t-sm",
        current
          ? "bg-white border-b-0"
          : "bg-alt-blue-france hover:bg-alt-blue-france-hover"
      )}
    >
      <span className="flex justify-between mb-2 text-title-blue-france">
        <strong>{title}</strong>
        <span className="fr-icon-arrow-right-line"></span>
      </span>
      {type === "verification" && (
        <Tag
          className="!bg-[var(--color-background-contrast-yellow-tournesol)] !text-[var(--color-text-action-high-yellow-tournesol)] font-bold"
          iconId="fr-icon-eye-line"
          small
        >
          À VÉRIFIER
        </Tag>
      )}
      {type === "completion" && (
        <Tag
          className="!bg-[var(--color-background-contrast-warning)]  !text-[var(--color-text-default-warning)] font-bold"
          iconId="fr-icon-eye-line"
          small
        >
          A COMPLÈTER
        </Tag>
      )}
    </Link>
  );
};

type Props = {
  title: ReactNode;
  route: string;
  current: boolean;
  type: "verification" | "completion";
};
