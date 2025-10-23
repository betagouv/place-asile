import { ReactElement } from "react";

import { ActesAdministratifsBlock } from "./_actes-administratifs/ActesAdministratifsBlock";
// import { ActivitesBlock } from "./(activites)/ActivitesBlock";
import { CalendrierBlock } from "./_calendrier/CalendrierBlock";
import { PrahdaDescriptionBlock } from "./_description/PrahdaDescriptionBlock";
// import { HudaPrahdaControlesBlock } from "./(controles)/HudaPrahdaControlesBlock";
import { NotesBlock } from "./_notes/NotesBlock";
import { PrahdaTypePlaceBlock } from "./_type-places/PrahdaTypePlaceBlock";
import { Section } from "./Section";

export const PrahdaStructure = (): ReactElement => {
  return (
    <>
      <Section id="description">
        <PrahdaDescriptionBlock />
      </Section>
      <Section id="calendrier">
        <CalendrierBlock />
      </Section>
      <Section id="places">
        <PrahdaTypePlaceBlock />
      </Section>
      {/* TODO : réajouter cette section quand il y aura des EIG et/ou évaluation */}
      {/* <Section id="controle">
        <HudaPrahdaControlesBlock />
      </Section> */}
      {/* <Section id="activites">
        <ActivitesBlock />
      </Section> */}
      <Section id="actes-administratifs">
        <ActesAdministratifsBlock />
      </Section>
      <Section id="notes">
        <NotesBlock />
      </Section>
    </>
  );
};
