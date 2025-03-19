import { StructureType } from "@/types/structure.type";
import Link from "next/link";
import { ReactElement } from "react";

export const StructureHeader = ({
  dnaCode,
  type,
  operateur,
  nom,
  commune,
  departement,
}: Props): ReactElement => {
  return (
    <div className="d-flex border-bottom fr-p-1w">
      <Link
        className="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-left-s-line"
        title="Retour aux structures d’hébergement"
        href="/structures"
      >
        Retour aux structures d’hébergement
      </Link>
      <div>
        <h2 className="text-blue-france fr-text--xs uppercase fr-mb-0">
          <strong className="fr-pr-2w">Structure hébergement</strong>
        </h2>
        <h3 className="text-blue-france fr-h6 fr-mb-0">
          <strong className="fr-pr-1w">{dnaCode}</strong>
          <strong className="fr-pr-1w">
            {type}, {operateur}
          </strong>
          <span className="fr-pr-1w">{" – "}</span>
          <span className="fr-mb-0 text-grey fr-text--lg italic">
            {nom ? `${nom}, ` : ""} {commune}, {departement}
          </span>
        </h3>
      </div>
    </div>
  );
};

type Props = {
  dnaCode: string;
  type: StructureType;
  operateur: string;
  nom: string | null;
  commune: string;
  departement: string;
};
