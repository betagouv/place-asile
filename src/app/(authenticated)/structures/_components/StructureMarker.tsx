import { LatLngTuple } from "leaflet";
import Link from "next/link";
import { ReactElement } from "react";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";

import {
  getOperateurLabel,
  getPlacesByCommunes,
} from "@/app/utils/structure.util";
import { Adresse, Repartition } from "@/types/adresse.type";
import { StructureType } from "@/types/structure.type";

import { singleMarkerIcon } from "../../../components/map/SingleMarker";
import { RepartitionBadge } from "./RepartitionBadge";

export const StructureMarker = ({
  id,
  dnaCode,
  coordinates,
  operateur,
  filiale,
  type,
  placesAutorisees,
  repartition,
  nom,
  commune,
  codePostal,
  departement,
  adresses,
  debutConvention,
  finConvention,
}: Props): ReactElement => {
  const getCommunesLabel = (): ReactElement => {
    const placesByCommunes = getPlacesByCommunes(adresses);
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
      <Popup
        className="[&>div]:rounded-none! [&>div>div]:m-6!"
        closeButton={false}
      >
        <div className="text-sm m-0 text-mention-grey">
          <strong>Code DNA</strong> {dnaCode}
        </div>
        <div className="text-xl text-title-blue-france m-0">
          <strong className="fr-pr-2w">
            {type} - {getOperateurLabel(filiale, operateur)}
          </strong>
          {placesAutorisees} places
        </div>
        <div className="text-title-blue-france">
          {nom ? `${nom}, ` : ""}
          {commune}, {departement} ({codePostal.substring(0, 2)})
        </div>
        {debutConvention && finConvention && (
          <div className="text-sm mt-1 mb-0">
            <strong>Convention en cours : </strong>
            <span>
              {new Date(debutConvention).toLocaleDateString("fr-FR")} -{" "}
              {new Date(finConvention).toLocaleDateString("fr-FR")}
            </span>
          </div>
        )}
        <div className="text-sm mt-1 mb-0">
          <strong>Bâti </strong>
          <span className="pr-1">
            <RepartitionBadge repartition={repartition} />
          </span>
          <span>{getCommunesLabel()}</span>
        </div>
        <div className="flex justify-end mt-2">
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
  operateur: string | null | undefined;
  filiale: string | null;
  type: StructureType;
  placesAutorisees: number | undefined;
  repartition: Repartition;
  nom: string | null;
  commune: string;
  codePostal: string;
  departement: string;
  adresses: Adresse[];
  debutConvention: Date | null;
  finConvention: Date | null;
};
