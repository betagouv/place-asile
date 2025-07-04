import { ReactElement } from "react";
// import { ActivitesBlock } from "./(activites)/ActivitesBlock";
import { CalendrierBlock } from "./(calendrier)/CalendrierBlock";
import { PrahdaTypePlaceBlock } from "./(type-places)/PrahdaTypePlaceBlock";
import { PrahdaDescriptionBlock } from "./(description)/PrahdaDescriptionBlock";
// import { HudaPrahdaControlesBlock } from "./(controles)/HudaPrahdaControlesBlock";
import { NotesBlock } from "./(notes)/NotesBlock";
import { Section } from "./components/Section";
import { ActesAdministratifsBlock } from "./(actes-administratifs)/ActesAdministratifsBlock";

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
