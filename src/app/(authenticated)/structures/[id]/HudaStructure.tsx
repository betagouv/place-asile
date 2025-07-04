import { ReactElement } from "react";
import { DefaultDescriptionBlock } from "./(description)/DefaultDescriptionBlock";
// import { ActivitesBlock } from "./(activites)/ActivitesBlock";
import { CalendrierBlock } from "./(calendrier)/CalendrierBlock";
import { HudaPrahdaControlesBlock } from "./(controles)/HudaPrahdaControlesBlock";
import { DefaultTypePlaceBlock } from "./(type-places)/DefaultTypePlaceBlock";
import { NotesBlock } from "./(notes)/NotesBlock";
import { Section } from "./components/Section";
import { ActesAdministratifsBlock } from "./(actes-administratifs)/ActesAdministratifsBlock";

export const HudaStructure = (): ReactElement => {
  return (
    <>
      <DefaultDescriptionBlock />
      <Section id="calendrier">
        <CalendrierBlock />
      </Section>
      <Section id="places">
        <DefaultTypePlaceBlock />
      </Section>
      <Section id="controle">
        <HudaPrahdaControlesBlock />
      </Section>
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
