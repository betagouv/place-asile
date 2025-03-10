import { ReactElement } from "react";
import { LatLngTuple } from "leaflet";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { singleMarkerIcon } from "../../components/map/SingleMarker";
import { RepartitionBadge } from "./RepartitionBadge";
import styles from "./StructureMarker.module.css";
import Link from "next/link";
import { getPlacesByCommunes } from "@/app/utils/structure.util";
import { Logement } from "@/types/logement.type";
import { Badge } from "@/app/components/common/Badge";

export const StructureMarker = ({
  id,
  dnaCode,
  coordinates,
  operateur,
  type,
  nbPlaces,
  repartition,
  nom,
  commune,
  codePostal,
  departement,
  logements,
  debutConvention,
  finConvention,
  qpv,
  cpom,
}: Props): ReactElement => {
  const getCommunesLabel = (): ReactElement => {
    const placesByCommunes = getPlacesByCommunes(logements);
    return (
      <>
        {Object.entries(placesByCommunes).map(
          (placeByCommune, index, communes) => (
            <span key={placeByCommune[0]}>
              {placeByCommune[0]}{" "}
              <span className="italic">({placeByCommune[1]} places)</span>
              {index < communes.length - 1 ? ", " : ""}
            </span>
          )
        )}
      </>
    );
  };

  return (
    <Marker position={coordinates} icon={singleMarkerIcon}>
      <Popup className={styles.container} closeButton={false}>
        <p className="fr-text--xs fr-m-0">DNA {dnaCode}</p>
        <p className="fr-text text-blue-france fr-text-title--blue-france fr-m-0">
          <strong className="fr-pr-2w">
            {type} - {operateur}
          </strong>
          {nbPlaces} places
        </p>
        <p className="fr-text--xs text-blue-france fr-m-0">
          {nom ? `${nom}, ` : ""}
          {commune}, {departement} ({codePostal.substring(0, 2)})
        </p>
        <p className="fr-text--xs fr-mt-0">
          <strong>Dans les communes de : </strong>
          <span>{getCommunesLabel()}</span>
        </p>
        <p className="fr-text--xs fr-mt-0">
          <strong>Convention en cours : </strong>
          <span>
            {new Date(debutConvention).toLocaleDateString()} -{" "}
            {new Date(finConvention).toLocaleDateString()}
          </span>
        </p>
        <span className="fr-pr-1w">
          <RepartitionBadge repartition={repartition} />
        </span>
        {qpv && (
          <span className="fr-pr-1w">
            <Badge type="warning">QPV</Badge>
          </span>
        )}
        {cpom && <Badge type="new">CPOM</Badge>}
        <div className="align-right">
          <Link
            className="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-right-line"
            title={`Détails de ${nom}`}
            href={`structures/${id}`}
          >
            Détails de {nom}
          </Link>
        </div>
      </Popup>
    </Marker>
  );
};

type Props = {
  id: number;
  dnaCode: string;
  coordinates: LatLngTuple;
  operateur: string;
  type: string;
  nbPlaces: number;
  repartition: string;
  nom: string | null;
  commune: string;
  codePostal: string;
  departement: string;
  logements: Logement[];
  debutConvention: Date;
  finConvention: Date;
  qpv: boolean;
  cpom: boolean;
};
