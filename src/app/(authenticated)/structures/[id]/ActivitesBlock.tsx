import { Block } from "@/app/components/common/Block";
import { Activite } from "@/types/activite.type";
import { ReactElement } from "react";
import { ActivitesPlaces } from "./ActivitesPlaces";
import { ActivitesMotifsIndisponibilite } from "./ActivitesMotifsIndisponibilite";
import Image from "next/image";
import ofii from "../../../../../public/ofii.webp";
import { ActivitesHistorique } from "./ActivitesHistorique";

export const ActivitesBlock = ({
  activites,
  debutConvention,
  finConvention,
}: Props): ReactElement => {
  return (
    <Block title="Activités" iconClass="fr-icon-team-line">
      <div className="flex">
        <span className="text-title-blue-france">
          Données mensuelles mises à jour le{" "}
          {new Date(activites?.[0]?.date).toLocaleDateString()}
        </span>
        <Image src={ofii} alt="Logo de l'OFII" width={35} height={35} />
      </div>
      <div className="fr-pb-3w">
        <ActivitesPlaces
          nbPlaces={activites[0]?.nbPlaces}
          placesIndisponibles={activites[0]?.placesIndisponibles}
          placesVacantes={activites[0]?.placesVacantes}
          placesPIBPI={activites[0]?.placesPIBPI}
          placesPIdeboutees={activites[0]?.placesPIdeboutees}
        />
      </div>
      <div className="fr-pb-3w">
        <ActivitesMotifsIndisponibilite
          desinsectisation={activites[0]?.desinsectisation}
          remiseEnEtat={activites[0]?.remiseEnEtat}
          sousOccupation={activites[0]?.sousOccupation}
          travaux={activites[0]?.travaux}
          placesHorsDnaNg={activites[0]?.placesHorsDnaNg}
        />
      </div>
      <ActivitesHistorique
        activites={activites}
        debutConvention={debutConvention}
        finConvention={finConvention}
      />
    </Block>
  );
};

type Props = {
  activites: Activite[];
  debutConvention: Date | null;
  finConvention: Date | null;
};
