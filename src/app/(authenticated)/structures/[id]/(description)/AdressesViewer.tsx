"use client";

import { ReactElement, useState } from "react";
import { useStructureContext } from "../context/StructureClientContext";
import { getRepartition } from "@/app/utils/structure.util";
import { Repartition } from "@/types/adresse.type";
import { CustomTag } from "@/app/components/ui/CustomTag";

export const AdressesViewer = (): ReactElement => {
  const [showAdresses, setShowAdresses] = useState(false);

  const { structure } = useStructureContext();
  const repartition = getRepartition(structure);
  const { adresses } = structure || {};

  return (
    <>
      <strong className="pr-3">Type de bâti</strong>
      <span className="pr-2">{repartition}</span>
      {adresses?.some(
        ({ adresseTypologies }) => adresseTypologies?.[0]?.qpv
      ) && (
        <span className="pr-2">
          <CustomTag>QPV</CustomTag>
        </span>
      )}
      {adresses?.some(
        ({ adresseTypologies }) => adresseTypologies?.[0]?.logementSocial
      ) && <CustomTag>Logement social</CustomTag>}
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
          {adresses?.map((adresse) => (
            <div key={adresse.id} className="pb-1">
              <span className="pr-2">
                {adresse.adresse}, {adresse.codePostal} {adresse.commune}{" "}
                <span className="italic">
                  ({adresse.adresseTypologies?.[0]?.placesAutorisees} places)
                </span>
                {" - "}
                {
                  Repartition[
                    adresse.repartition as unknown as keyof typeof Repartition
                  ]
                }
              </span>
              {adresse.adresseTypologies?.[0]?.qpv !== 0 && (
                <span className="pr-1">
                  <CustomTag>QPV</CustomTag>
                </span>
              )}
              {adresse.adresseTypologies?.[0]?.logementSocial !== 0 && (
                <CustomTag>Logement social</CustomTag>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
