import { ReactElement } from "react";
import { LatLngTuple } from "leaflet";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { singleMarkerIcon } from "../../components/map/SingleMarker";
import { TypologieBadge } from "./TypologieBadge";
import styles from "./CentreMarker.module.css";
import Link from "next/link";

export const CentreMarker = ({
  coordinates,
  adresseHebergement,
  operateur,
  type,
  nbPlaces,
  typologie,
  codePostal,
  commune,
  id,
}: Props): ReactElement => {
  return (
    <Marker position={coordinates} icon={singleMarkerIcon}>
      <Popup className={styles.container} closeButton={false}>
        <p className="fr-text--xs fr-m-0">{type}</p>
        <p className="fr-text text-blue-france fr-text-title--blue-france fr-m-0">
          <strong>{operateur}</strong> - {nbPlaces} places
        </p>
        <p className="fr-text--xs fr-m-0">
          {adresseHebergement}, {codePostal} {commune}
        </p>
        <TypologieBadge typologie={typologie} />
        <div className="align-right">
          <Link
            className="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-right-line"
            title={`Détails de ${adresseHebergement}`}
            href={`centres/${id}`}
          >
            Détails de {adresseHebergement}
          </Link>
        </div>
      </Popup>
    </Marker>
  );
};

type Props = {
  coordinates: LatLngTuple;
  adresseHebergement: string;
  operateur: string;
  type: string;
  nbPlaces: number;
  typologie: string;
  codePostal: string;
  commune: string;
  id: number;
};
