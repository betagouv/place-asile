"use client";

import { Badge } from "@/app/components/common/Badge";
import { Logement } from "@/types/logement.type";
import { Repartition } from "@/types/structure.type";
import { ReactElement, useState } from "react";

export const LogementsViewer = ({
  repartition,
  logements,
}: Props): ReactElement => {
  const [showLogements, setShowLogements] = useState(false);

  return (
    <>
      <strong className="fr-pr-2w">Type de bâti</strong>
      <span className="fr-pr-1w">{repartition}</span>
      {logements.some(({ qpv }) => qpv) && (
        <span className="fr-pr-1w">
          <Badge type="warning">QPV</Badge>
        </span>
      )}
      {logements.some(({ logementSocial }) => logementSocial) && (
        <Badge type="new">Logement social</Badge>
      )}
      <button
        className={`fr-btn fr-btn--sm fr-btn--icon-left fr-btn--tertiary-no-outline ${
          showLogements ? "fr-icon-eye-off-line" : "fr-icon-eye-line"
        }`}
        onClick={() => setShowLogements(!showLogements)}
      >
        {showLogements
          ? "Masquer la liste des hébergements"
          : "Voir la liste des hébergements"}
      </button>
      {showLogements && (
        <div className="text-grey">
          {logements.map((logement) => (
            <div key={logement.id}>
              <span className="fr-pr-3w">
                {logement.adresse}, {logement.codePostal} {logement.ville}{" "}
                <span className="italic">({logement.nbPlaces} places)</span>
              </span>
              {logement.qpv && (
                <span className="fr-pr-1w">
                  <Badge type="warning">QPV</Badge>
                </span>
              )}
              {logement.logementSocial && (
                <Badge type="new">Logement social</Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

type Props = {
  repartition: Repartition;
  logements: Logement[];
};
