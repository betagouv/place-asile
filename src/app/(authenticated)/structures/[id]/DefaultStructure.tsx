import { Structure } from "@/types/structure.type";
import { ReactElement, Ref } from "react";
import { StructureHeader } from "./(header)/StructureHeader";
import { DefaultDescriptionBlock } from "./(description)/DefaultDescriptionBlock";
import {
  getRepartition,
  getCurrentPlacesQpv,
  getCurrentPlacesLogementsSociaux,
} from "@/app/utils/structure.util";
import { ActivitesBlock } from "./(activites)/ActivitesBlock";
import { CalendrierBlock } from "./(calendrier)/CalendrierBlock";
import { DefaultControlesBlock } from "./(controles)/DefaultControlesBlock";
import { DefaultTypePlaceBlock } from "./(type-places)/DefaultTypePlaceBlock";

export const DefaultStructure = ({
  structure,
  structureHeaderHeight,
  structureHeaderRef,
}: Props): ReactElement => {
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
          <DefaultDescriptionBlock
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
          <DefaultTypePlaceBlock
            adresses={structure.adresses || []}
            structureTypologies={structure.typologies || []}
            placesAutorisees={structure.nbPlaces}
            placesACreer={structure.placesACreer}
            placesAFermer={structure.placesAFermer}
            echeancePlacesACreer={structure.echeancePlacesACreer}
            echeancePlacesAFermer={structure.echeancePlacesAFermer}
            placesPmr={structure?.typologies?.[0]?.pmr || 0}
            placesLgbt={structure?.typologies?.[0]?.lgbt || 0}
            placesFvvTeh={structure?.typologies?.[0]?.fvvTeh || 0}
            placesQPV={getCurrentPlacesQpv(structure)}
            placesLogementsSociaux={getCurrentPlacesLogementsSociaux(structure)}
          />
        </section>
        <section
          style={{ scrollMarginTop: `${structureHeaderHeight}px` }}
          id="controle"
        >
          <DefaultControlesBlock
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
};

type Props = {
  structure: Structure;
  structureHeaderHeight: number;
  structureHeaderRef: Ref<HTMLDivElement>;
};
