"use client";

import { Badge } from "@/app/components/common/Badge";
import { Adresse, Repartition } from "@/types/adresse.type";
import { ReactElement, useState } from "react";

export const AdressesViewer = ({
  repartition,
  adresses,
}: Props): ReactElement => {
  const [showAdresses, setShowAdresses] = useState(false);

  return (
    <>
      <strong className="fr-pr-2w">Type de bâti</strong>
      <span className="fr-pr-1w">{repartition}</span>
      {adresses.some(({ typologies }) => typologies?.[0]?.qpv) && (
        <span className="fr-pr-1w">
          <Badge type="warning">QPV</Badge>
        </span>
      )}
      {adresses.some(({ typologies }) => typologies?.[0]?.logementSocial) && (
        <Badge type="warning">Logement social</Badge>
      )}
      <button
        className={`fr-btn fr-btn--sm fr-btn--icon-left fr-btn--tertiary-no-outline ${
          showAdresses ? "fr-icon-eye-off-line" : "fr-icon-eye-line"
        }`}
        onClick={() => setShowAdresses(!showAdresses)}
      >
        {showAdresses
          ? "Masquer la liste des hébergements"
          : "Voir la liste des hébergements"}
      </button>
      {showAdresses && (
        <div className="text-mention-grey">
          {adresses.map((adresse) => (
            <div key={adresse.id}>
              <span className="fr-pr-3w">
                {adresse.adresse}, {adresse.codePostal} {adresse.commune}{" "}
                <span className="italic">
                  ({adresse.typologies?.[0]?.nbPlacesTotal} places)
                </span>
              </span>
              {adresse.typologies?.[0]?.qpv && (
                <span className="fr-pr-1w">
                  <Badge type="warning">QPV</Badge>
                </span>
              )}
              {adresse.typologies?.[0]?.logementSocial && (
                <Badge type="warning">Logement social</Badge>
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
  adresses: Adresse[];
};
