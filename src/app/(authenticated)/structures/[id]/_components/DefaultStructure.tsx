import { ReactElement } from "react";

import { useStructureContext } from "../_context/StructureClientContext";
import { ActesAdministratifsBlock } from "./_actes-administratifs/ActesAdministratifsBlock";
// import { ActivitesBlock } from "./(activites)/ActivitesBlock";
import { CalendrierBlock } from "./_calendrier/CalendrierBlock";
import { DefaultControlesBlock } from "./_controles/DefaultControlesBlock";
import { DefaultDescriptionBlock } from "./_description/DefaultDescriptionBlock";
import { FinancesBlock } from "./_finances/FinancesBlock";
import { NotesBlock } from "./_notes/NotesBlock";
import { DefaultTypePlaceBlock } from "./_type-places/DefaultTypePlaceBlock";
import { Section } from "./Section";

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
