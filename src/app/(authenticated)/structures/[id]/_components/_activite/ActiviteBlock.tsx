import Image from "next/image";
import { ReactElement } from "react";

import { Block } from "@/app/components/common/Block";
import { formatDate } from "@/app/utils/date.util";

import ofii from "../../../../../../../public/ofii.webp";
import { useStructureContext } from "../../_context/StructureClientContext";
import { ActiviteHistorique } from "./ActiviteHistorique";
import { ActiviteMotifsIndisponibilite } from "./ActiviteMotifsIndisponibilite";
import { ActivitePlaces } from "./ActivitePlaces";

export const ActiviteBlock = (): ReactElement => {
  const { structure } = useStructureContext();

  const { activites, debutConvention, finConvention } = structure;

  return (
    <Block title="Activité" iconClass="fr-icon-team-line">
      <div className="flex pb-12">
        <span className="text-title-blue-france">
          Données mensuelles mises à jour le {formatDate(activites?.[0]?.date)}
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
      <div className="pb-6">
        <ActivitePlaces
          nbPlaces={activites?.[0]?.nbPlaces || 0}
          placesIndisponibles={activites?.[0]?.placesIndisponibles || 0}
          placesVacantes={activites?.[0]?.placesVacantes || 0}
          presencesInduesBPI={activites?.[0]?.presencesInduesBPI || 0}
          presencesInduesDeboutees={
            activites?.[0]?.presencesInduesDeboutees || 0
          }
        />
      </div>
      <div className="pb-12">
        <ActiviteMotifsIndisponibilite
          desinsectisation={activites?.[0]?.desinsectisation || 0}
          remiseEnEtat={activites?.[0]?.remiseEnEtat || 0}
          sousOccupation={activites?.[0]?.sousOccupation || 0}
          travaux={activites?.[0]?.travaux || 0}
        />
      </div>
      <ActiviteHistorique
        activites={activites || []}
        debutConvention={debutConvention}
        finConvention={finConvention}
      />
      <div className="italic pt-6">
        La méthode de calcul ayant changé au 01/01/2025, l’outil donne accès aux
        données seulement à partir de cette date.
      </div>
    </Block>
  );
};
