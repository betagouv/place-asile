import Link from "next/link";
import { ReactElement } from "react";

export const StructureHeader = ({
  type,
  operateur,
  nbPlaces,
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
        <h2 className="text-blue-france fr-h6 fr-mb-0">
          <strong className="fr-pr-2w">
            {type} - {operateur}
          </strong>
          {nbPlaces} places
        </h2>
        <p className="fr-mb-0 text-blue-france fr-text">
          {nom}, {commune}, {departement}
        </p>
      </div>
    </div>
  );
};

type Props = {
  type: string;
  operateur: string;
  nbPlaces: number;
  nom: string | null;
  commune: string;
  departement: string;
};
