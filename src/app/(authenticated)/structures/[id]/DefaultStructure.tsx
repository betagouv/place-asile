import { ReactElement } from "react";
import { DefaultDescriptionBlock } from "./(description)/DefaultDescriptionBlock";
import { CalendrierBlock } from "./(calendrier)/CalendrierBlock";
import { Section } from "./components/Section";
import { DefaultTypePlaceBlock } from "./(type-places)/DefaultTypePlaceBlock";
import { DefaultControlesBlock } from "./(controles)/DefaultControlesBlock";
import { ActivitesBlock } from "./(activites)/ActivitesBlock";
import { NotesBlock } from "./(notes)/NotesBlock";
import { FinancesBlock } from "./(finances)/FinancesBlock";

export const DefaultStructure = (): ReactElement => {
  return (
    <>
      <Section id="description">
        <DefaultDescriptionBlock />
      </Section>
      <Section id="calendrier">
        <CalendrierBlock />
      </Section>
      <Section id="places">
        <DefaultTypePlaceBlock />
      </Section>
      <Section id="finances">
        <FinancesBlock />
      </Section>
      <Section id="controle">
        <DefaultControlesBlock />
      </Section>
      <Section id="activites">
        <ActivitesBlock />
      </Section>
      <Section id="notes">
        <NotesBlock />
      </Section>
    </>
  );
};
