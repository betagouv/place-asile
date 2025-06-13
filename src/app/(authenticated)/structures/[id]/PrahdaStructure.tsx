import { Structure } from "@/types/structure.type";
import { ReactElement } from "react";
import { getRepartition } from "@/app/utils/structure.util";
import { ActivitesBlock } from "./(activites)/ActivitesBlock";
import { CalendrierBlock } from "./(calendrier)/CalendrierBlock";
import { PrahdaTypePlaceBlock } from "./(type-places)/PrahdaTypePlaceBlock";
import { PrahdaDescriptionBlock } from "./(description)/PrahdaDescriptionBlock";
import { HudaPrahdaControlesBlock } from "./(controles)/HudaPrahdaControlesBlock";
import { NotesBlock } from "./(notes)/NotesBlock";

export const PrahdaStructure = ({ structure }: Props): ReactElement => {
  return (
    <>
      <section
        style={{ scrollMarginTop: "var(--structure-header-height)" }}
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
        style={{ scrollMarginTop: "var(--structure-header-height)" }}
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
        style={{ scrollMarginTop: "var(--structure-header-height)" }}
        id="places"
      >
        <PrahdaTypePlaceBlock placesAutorisees={structure.nbPlaces} />
      </section>
      <section
        style={{ scrollMarginTop: "var(--structure-header-height)" }}
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
        style={{ scrollMarginTop: "var(--structure-header-height)" }}
        id="activites"
      >
        <ActivitesBlock
          activites={structure.activites || []}
          debutConvention={structure.debutConvention}
          finConvention={structure.finConvention}
        />
      </section>
      <section
        style={{ scrollMarginTop: "var(--structure-header-height)" }}
        id="notes"
      >
        <NotesBlock notes={structure.notes} />
      </section>
    </>
  );
};

type Props = {
  structure: Structure;
};
