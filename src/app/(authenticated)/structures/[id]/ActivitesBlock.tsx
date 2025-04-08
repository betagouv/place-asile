import { Block } from "@/app/components/common/Block";
import { Activite } from "@/types/activite.type";
import { ReactElement } from "react";
import { ActivitesPlaces } from "./ActivitesPlaces";

export const ActivitesBlock = ({ activites }: Props): ReactElement => {
  return (
    <Block title="Activités" iconClass="fr-icon-team-line">
      <span className="text-title-blue-france">
        Données mensuelles mises à jour le{" "}
        {new Date(activites?.[0]?.date).toLocaleDateString()}
      </span>
      <ActivitesPlaces
        nbPlaces={activites[0].nbPlaces}
        placesIndisponibles={activites[0].placesIndisponibles}
        placesVacantes={activites[0].placesVacantes}
        placesPIBPI={activites[0].placesPIBPI}
        placesPIdeboutees={activites[0].placesPIdeboutees}
      />
    </Block>
  );
};

type Props = {
  activites: Activite[];
};
