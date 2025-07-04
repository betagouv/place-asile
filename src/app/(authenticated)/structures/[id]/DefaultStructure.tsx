import { ReactElement } from "react";
import { DefaultDescriptionBlock } from "./(description)/DefaultDescriptionBlock";
import { CalendrierBlock } from "./(calendrier)/CalendrierBlock";
import { Section } from "./components/Section";
import { DefaultTypePlaceBlock } from "./(type-places)/DefaultTypePlaceBlock";
import { DefaultControlesBlock } from "./(controles)/DefaultControlesBlock";
// import { ActivitesBlock } from "./(activites)/ActivitesBlock";
import { NotesBlock } from "./(notes)/NotesBlock";
import { FinancesBlock } from "./(finances)/FinancesBlock";
import { ActesAdministratifsBlock } from "./(actes-administratifs)/ActesAdministratifsBlock";
import { useStructureContext } from "./context/StructureClientContext";

export const DefaultStructure = (): ReactElement => {
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
      {structure?.controles && structure.controles?.length > 0 && (
        <Section id="controle">
          <DefaultControlesBlock />
        </Section>
      )}
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
