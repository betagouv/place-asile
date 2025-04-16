"use client";

import React, { useEffect, useRef, useState } from "react";
import { CalendrierBlock } from "./(calendrier)/CalendrierBlock";
import { TypePlaceBlock } from "./(type-places)/TypePlaceBlock";
import { ControlesBlock } from "./(controles)/ControlesBlock";
import {
  getCurrentPlacesFvvTeh,
  getCurrentPlacesLgbt,
  getCurrentPlacesLogementsSociaux,
  getCurrentPlacesQpv,
  getRepartition,
} from "@/app/utils/structure.util";
import { StructureHeader } from "./(header)/StructureHeader";
import { DescriptionBlock } from "./(description)/DescriptionBlock";
import { ActivitesBlock } from "./(activites)/ActivitesBlock";
import { Structure } from "@/types/structure.type";

export default function StructureContent({ structure }: StructureContentProps) {
  const [structureHeaderHeight, setStructureHeaderHeight] = useState(130);
  const structureHeaderRef = useRef<HTMLDivElement>(null);

  const updateHeaderHeight = () => {
    if (structureHeaderRef.current) {
      const height =
        structureHeaderRef.current.getBoundingClientRect().height + 8;
      setStructureHeaderHeight(height);
    }
  };

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      updateHeaderHeight();
    }, 100);

    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  return (
    <>
      <StructureHeader
        type={structure.type}
        operateur={structure.operateur}
        nbPlaces={structure.nbPlaces}
        nom={structure.nom}
        commune={structure.communeAdministrative}
        departement={structure.departementAdministratif}
        ref={structureHeaderRef}
      />
      <div className="bg-grey flex flex-col gap-2 p-4">
        <section
          style={{ scrollMarginTop: `${structureHeaderHeight}px` }}
          id="description"
        >
          <DescriptionBlock
            creationDate={structure.creationDate}
            dnaCode={structure.dnaCode}
            operateur={structure.operateur}
            publicType={structure.public}
            adresse={structure.adresseAdministrative}
            nom={structure.nom}
            codePostal={structure.codePostalAdministratif}
            commune={structure.communeAdministrative}
            repartition={getRepartition(structure)}
            type={structure.type}
            finessCode={structure.finessCode}
            cpom={structure.cpom}
            lgbt={structure.lgbt}
            fvvTeh={structure.fvvTeh}
            contacts={structure.contacts || []}
            adresses={structure.adresses || []}
          />
        </section>
        <section
          style={{ scrollMarginTop: `${structureHeaderHeight}px` }}
          id="calendrier"
        >
          <CalendrierBlock
            debutPeriodeAutorisation={structure.debutPeriodeAutorisation}
            finPeriodeAutorisation={structure.finPeriodeAutorisation}
            debutConvention={structure.debutConvention}
            finConvention={structure.finConvention}
            debutCpom={structure.debutCpom}
            finCpom={structure.finCpom}
          />
        </section>
        <section
          style={{ scrollMarginTop: `${structureHeaderHeight}px` }}
          id="places"
        >
          <TypePlaceBlock
            adresses={structure.adresses || []}
            pmrs={structure.pmrs || []}
            placesAutorisees={structure.nbPlaces}
            placesACreer={structure.placesACreer}
            placesAFermer={structure.placesAFermer}
            echeancePlacesACreer={structure.echeancePlacesACreer}
            echeancePlacesAFermer={structure.echeancePlacesAFermer}
            placesPmr={structure?.pmrs?.[0]?.nbPlaces || 10}
            placesLgbt={getCurrentPlacesLgbt(structure)}
            placesFvvTeh={getCurrentPlacesFvvTeh(structure)}
            placesQPV={getCurrentPlacesQpv(structure)}
            placesLogementsSociaux={getCurrentPlacesLogementsSociaux(structure)}
          />
        </section>
        <section
          style={{ scrollMarginTop: `${structureHeaderHeight}px` }}
          id="controle"
        >
          <ControlesBlock
            evaluations={structure.evaluations || []}
            controles={structure.controles || []}
            evenementsIndesirablesGraves={
              structure.evenementsIndesirablesGraves || []
            }
          />
        </section>
        <section
          style={{ scrollMarginTop: `${structureHeaderHeight}px` }}
          id="activites"
        >
          <ActivitesBlock
            activites={structure.activites || []}
            debutConvention={structure.debutConvention}
            finConvention={structure.finConvention}
          />
        </section>
      </div>
    </>
  );
}

type StructureContentProps = {
  structure: Structure;
};
