import { ReactElement } from "react";
import { LatLngTuple } from "leaflet";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { singleMarkerIcon } from "../../components/map/SingleMarker";
import { TypologieBadge } from "./TypologieBadge";
import styles from "./StructureMarker.module.css";
import Link from "next/link";
import { Structure } from "@/types/structure.type";
import { getPlacesByCommunes } from "@/app/utils/structure.util";

export const StructureMarker = ({
  id,
  coordinates,
  adresseOperateur,
  operateur,
  type,
  nbPlaces,
  typologie,
  attachedStructures,
}: Props): ReactElement => {
  const getCommunesLabel = (): ReactElement => {
    const placesByCommunes = getPlacesByCommunes(attachedStructures);
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
        <p className="fr-text--xs fr-m-0">{type}</p>
        <p className="fr-text text-blue-france fr-text-title--blue-france fr-m-0">
          <strong>{operateur}</strong> - {nbPlaces} places
        </p>
        <p className="fr-text--xs text-blue-france fr-m-0">
          {adresseOperateur}
        </p>
        <p className="fr-text--xs fr-mt-0">
          <strong>Dans les communes de : </strong>
          <span>{getCommunesLabel()}</span>
        </p>
        <TypologieBadge typologie={typologie} />
        <div className="align-right">
          <Link
            className="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-right-line"
            title={`Détails de ${adresseOperateur}`}
            href={`structures/${id}`}
          >
            Détails de {adresseOperateur}
          </Link>
        </div>
      </Popup>
    </Marker>
  );
};

type Props = {
  id: number;
  coordinates: LatLngTuple;
  adresseOperateur: string;
  operateur: string;
  type: string;
  nbPlaces: number;
  typologie: string;
  attachedStructures: Structure[];
};
