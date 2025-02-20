import Link from "next/link";
import { ReactElement } from "react";

export const CentreHeader = ({
  type,
  operateur,
  adresse,
  codePostal,
  commune,
}: Props): ReactElement => {
  return (
    <div className="d-flex border-bottom fr-p-1w">
      <Link
        className="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-left-s-line"
        title="Retour aux centres"
        href="/centres"
      >
        Retour aux centres
      </Link>
      <div>
        <h2 className="text-blue-france fr-h6 fr-mb-0">
          {type} - {operateur}
        </h2>
        <p className="fr-mb-0 text-grey fr-text">
          {adresse}, {codePostal} {commune}
        </p>
      </div>
    </div>
  );
};

type Props = {
  type: string;
  operateur: string;
  adresse: string;
  codePostal: string;
  commune: string;
};
