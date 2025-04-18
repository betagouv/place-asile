import { Structure } from "@/types/structure.type";
import { ReactElement, Ref } from "react";
import { StructureHeader } from "./(header)/StructureHeader";
import { getRepartition } from "@/app/utils/structure.util";
import { ActivitesBlock } from "./(activites)/ActivitesBlock";
import { CalendrierBlock } from "./(calendrier)/CalendrierBlock";
import { PrahdaTypePlaceBlock } from "./(type-places)/PrahdaTypePlaceBlock";
import { PrahdaDescriptionBlock } from "./(description)/PrahdaDescriptionBlock";
import { HudaPrahdaControlesBlock } from "./(controles)/HudaPrahdaControlesBlock";

export const PrahdaStructure = ({
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
          <PrahdaDescriptionBlock
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
            contacts={structure.contacts || []}
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
          <PrahdaTypePlaceBlock placesAutorisees={structure.nbPlaces} />
        </section>
        <section
          style={{ scrollMarginTop: `${structureHeaderHeight}px` }}
          id="controle"
        >
          <HudaPrahdaControlesBlock
            evaluations={structure.evaluations || []}
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
