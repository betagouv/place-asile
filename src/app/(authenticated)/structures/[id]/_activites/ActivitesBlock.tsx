import Image from "next/image";
import { ReactElement } from "react";

import { Block } from "@/app/components/common/Block";

import ofii from "../../../../../../public/ofii.webp";
import { useStructureContext } from "../context/StructureClientContext";
import { ActivitesHistorique } from "./ActivitesHistorique";
import { ActivitesMotifsIndisponibilite } from "./ActivitesMotifsIndisponibilite";
import { ActivitesPlaces } from "./ActivitesPlaces";

export const ActivitesBlock = (): ReactElement => {
  const { structure } = useStructureContext();

  const { activites, debutConvention, finConvention } = structure;

  return (
    <Block title="Activités" iconClass="fr-icon-team-line">
      <div className="flex">
        <span className="text-title-blue-france">
          Données mensuelles mises à jour le{" "}
          {new Date(activites?.[0]?.date || new Date()).toLocaleDateString(
            "fr-FR"
          )}
        </span>
        <div style={{ position: "relative", width: 40 }}>
          <Image
            src={ofii}
            alt="Logo de l'OFII"
            fill
            sizes="(min-width: 40px)"
          />
        </div>
      </div>
      <div className="pb-3">
        <ActivitesPlaces
          nbPlaces={activites?.[0]?.nbPlaces || 0}
          placesIndisponibles={activites?.[0]?.placesIndisponibles || 0}
          placesVacantes={activites?.[0]?.placesVacantes || 0}
          presencesInduesBPI={activites?.[0]?.presencesInduesBPI || 0}
          presencesInduesDeboutees={
            activites?.[0]?.presencesInduesDeboutees || 0
          }
        />
      </div>
      <div className="pb-3">
        <ActivitesMotifsIndisponibilite
          desinsectisation={activites?.[0]?.desinsectisation || 0}
          remiseEnEtat={activites?.[0]?.remiseEnEtat || 0}
          sousOccupation={activites?.[0]?.sousOccupation || 0}
          travaux={activites?.[0]?.travaux || 0}
        />
      </div>
      <ActivitesHistorique
        activites={activites || []}
        debutConvention={debutConvention || null}
        finConvention={finConvention || null}
      />
    </Block>
  );
};
