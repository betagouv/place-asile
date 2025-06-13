import { Structure } from "@/types/structure.type";
import { ReactElement } from "react";
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
import { NotesBlock } from "./(notes)/NotesBlock";
import { Section } from "./components/Section";

export const DefaultStructure = ({ structure }: Props): ReactElement => {
  // TODO : Refac props from blocks to remove the props and pass them from context
  return (
    <>
      <Section id="description">
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
      </Section>
      <Section id="calendrier">
        <CalendrierBlock
          debutPeriodeAutorisation={structure.debutPeriodeAutorisation}
          finPeriodeAutorisation={structure.finPeriodeAutorisation}
          debutConvention={structure.debutConvention}
          finConvention={structure.finConvention}
          debutCpom={structure.debutCpom}
          finCpom={structure.finCpom}
        />
      </Section>
      <Section id="places">
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
      </Section>
      <Section id="controle">
        <DefaultControlesBlock
          evaluations={structure.evaluations || []}
          controles={structure.controles || []}
          evenementsIndesirablesGraves={
            structure.evenementsIndesirablesGraves || []
          }
        />
      </Section>
      <Section id="activites">
        <ActivitesBlock
          activites={structure.activites || []}
          debutConvention={structure.debutConvention}
          finConvention={structure.finConvention}
        />
      </Section>
      <Section id="notes">
        <NotesBlock notes={structure.notes} />
      </Section>
    </>
  );
};

type Props = {
  structure: Structure;
};
