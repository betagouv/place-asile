import Tag from "@codegouvfr/react-dsfr/Tag";
import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "@/app/utils/classname.util";

import { useStructureContext } from "../../_context/StructureClientContext";

export const Tab = ({ title, route, current, type }: Props) => {
  const { structure } = useStructureContext();
  const isCompleted = structure.finalisationSteps?.some(
    (step) => step.label === route
  );
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
      {type === "verification" &&
        (isCompleted ? (
          <Tag
            className="!bg-[var(--success-950-100)] !text-[var(---success-425-625)] font-bold"
            iconId="fr-icon-check-line"
            small
          >
            VÉRIFIÉ
          </Tag>
        ) : (
          <Tag
            className="!bg-[var(--color-background-contrast-yellow-tournesol)] !text-[var(--color-text-action-high-yellow-tournesol)] font-bold"
            iconId="fr-icon-eye-line"
            small
          >
            À VÉRIFIER
          </Tag>
        ))}

      {type === "completion" &&
        (isCompleted ? (
          <Tag
            className="!bg-[var(--success-950-100)] !text-[var(---success-425-625)] font-bold"
            iconId="fr-icon-check-line"
            small
          >
            COMPLÉTÉ
          </Tag>
        ) : (
          <Tag
            className="!bg-[var(--color-background-contrast-warning)]  !text-[var(--color-text-default-warning)] font-bold"
            iconId="fr-icon-eye-line"
            small
          >
            A COMPLÈTER
          </Tag>
        ))}
    </Link>
  );
};

type Props = {
  title: ReactNode;
  route: string;
  current: boolean;
  type: "verification" | "completion";
};
