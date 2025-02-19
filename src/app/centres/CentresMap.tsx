"use client";

import { ReactElement } from "react";

import { CentreMarker } from "./CentreMarker";
import { Centre } from "../../types/centre.type";
import { Map } from "../components/map/Map";

const CentresMap = ({ centres }: Props): ReactElement => {
  return (
    <Map>
      {centres.map(
        (
          {
            coordinates,
            adresseHebergement,
            operateur,
            type,
            nbPlaces,
            typologie,
            codePostalHebergement,
            communeHebergement,
            id,
          },
          index
        ) => (
          <CentreMarker
            coordinates={coordinates}
            adresseHebergement={adresseHebergement}
            operateur={operateur}
            type={type}
            nbPlaces={nbPlaces}
            typologie={typologie}
            codePostal={codePostalHebergement}
            commune={communeHebergement}
            id={id}
            key={index}
          />
        )
      )}
    </Map>
  );
};

type Props = {
  centres: Centre[];
};

export default CentresMap;
