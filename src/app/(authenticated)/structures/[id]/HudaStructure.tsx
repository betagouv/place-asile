import { ReactElement } from "react";
import { DefaultDescriptionBlock } from "./(description)/DefaultDescriptionBlock";
// import { ActivitesBlock } from "./(activites)/ActivitesBlock";
import { CalendrierBlock } from "./(calendrier)/CalendrierBlock";
// import { HudaPrahdaControlesBlock } from "./(controles)/HudaPrahdaControlesBlock";
import { DefaultTypePlaceBlock } from "./(type-places)/DefaultTypePlaceBlock";
import { NotesBlock } from "./(notes)/NotesBlock";
import { Section } from "./components/Section";
import { ActesAdministratifsBlock } from "./(actes-administratifs)/ActesAdministratifsBlock";
import { useStructureContext } from "./context/StructureClientContext";
import { FinancesBlock } from "./(finances)/FinancesBlock";

export const HudaStructure = (): ReactElement => {
  const { structure } = useStructureContext();

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
      {structure.budgets && structure.budgets?.length > 0 && (
        <Section id="finances">
          <FinancesBlock />
        </Section>
      )}
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
