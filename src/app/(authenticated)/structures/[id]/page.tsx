import { Structure } from "@/types/structure.type";
import { StructureHeader } from "./StructureHeader";
import { DescriptionBlock } from "./DescriptionBlock";
import { ReactElement } from "react";
import { CalendrierBlock } from "./CalendrierBlock";
import { TypePlaceBlock } from "./TypePlaceBlock";
import { ControlesBlock } from "./ControlesBlock";
import {
  getCurrentPlacesFvvTeh,
  getCurrentPlacesLgbt,
  getCurrentPlacesLogementsSociaux,
  getCurrentPlacesQpv,
  getRepartition,
} from "@/app/utils/structure.util";
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router";
import { ActivitesBlock } from "./ActivitesBlock";

export default async function StructureDetails({
  params,
}: Params): Promise<ReactElement> {
  const { id } = await params;
  const result = await fetch(`${process.env.NEXT_URL}/api/structures/${id}`);
  const structure: Structure = await result.json();

  return (
    <>
      <StartDsfrOnHydration />
      <StructureHeader
        type={structure.type}
        operateur={structure.operateur}
        nbPlaces={structure.nbPlaces}
        nom={structure.nom}
        commune={structure.communeAdministrative}
        departement={structure.departementAdministratif}
      />
      <div className="bg-grey fr-p-1w">
        <section className="fr-pb-1w" id="description">
          <DescriptionBlock
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
        </section>
        <section className="fr-pb-1w" id="calendrier">
          <CalendrierBlock
            debutPeriodeAutorisation={structure.debutPeriodeAutorisation}
            finPeriodeAutorisation={structure.finPeriodeAutorisation}
            debutConvention={structure.debutConvention}
            finConvention={structure.finConvention}
            debutCpom={structure.debutCpom}
            finCpom={structure.finCpom}
          />
        </section>
        <section className="fr-pb-1w" id="places">
          <TypePlaceBlock
            adresses={structure.adresses || []}
            pmrs={structure.pmrs || []}
            placesAutorisees={structure.nbPlaces}
            placesACreer={structure.placesACreer}
            placesAFermer={structure.placesAFermer}
            echeancePlacesACreer={structure.echeancePlacesACreer}
            echeancePlacesAFermer={structure.echeancePlacesAFermer}
            placesPmr={structure?.pmrs?.[0]?.nbPlaces || 10}
            placesLgbt={getCurrentPlacesLgbt(structure)}
            placesFvvTeh={getCurrentPlacesFvvTeh(structure)}
            placesQPV={getCurrentPlacesQpv(structure)}
            placesLogementsSociaux={getCurrentPlacesLogementsSociaux(structure)}
          />
        </section>
        <section className="fr-pb-1w" id="controle">
          <ControlesBlock
            evaluations={structure.evaluations || []}
            controles={structure.controles || []}
            evenementsIndesirablesGraves={
              structure.evenementsIndesirablesGraves || []
            }
          />
        </section>
        <section className="fr-pb-1w" id="activites">
          <ActivitesBlock activites={structure.activites || []} />
        </section>
      </div>
    </>
  );
}

type Params = {
  params: Promise<{ id: number }>;
};
