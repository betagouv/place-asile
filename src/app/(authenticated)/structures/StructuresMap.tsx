"use client";

import { ReactElement } from "react";

import { StructureMarker } from "./StructureMarker";
import { Structure } from "../../../types/structure.type";
import { Map } from "../../components/map/Map";

const StructuresMap = ({ structures }: Props): ReactElement => {
  return (
    <Map>
      {structures.map(
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
          <StructureMarker
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
  structures: Structure[];
};

export default StructuresMap;
