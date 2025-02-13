import { ReactElement } from "react";
import { LatLngTuple } from "leaflet";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import styles from "./MapMarker.module.css";
import { Badge } from "../components/Badge";

export const MapMarker = ({
  coordinates,
  adresseHebergement,
  operateur,
  type,
  nbPlaces,
  typologie,
}: Props): ReactElement => {
  return (
    <Marker position={coordinates || [0, 0]}>
      <Popup className={styles.container} closeButton={false}>
        <p className="fr-text--xs fr-m-0">{type}</p>
        <p className="fr-text text-blue-france fr-text-title--blue-france fr-m-0">
          <strong>{operateur}</strong> - {nbPlaces} places
        </p>
        <p className="fr-text--xs fr-m-0">{adresseHebergement}</p>
        <Badge>{typologie}</Badge>
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
};
