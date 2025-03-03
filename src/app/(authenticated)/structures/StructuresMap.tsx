"use client";

import { ReactElement } from "react";

import { StructureMarker } from "./StructureMarker";
import { StructureAdministrative } from "../../../types/structure.type";
import { Map } from "../../components/map/Map";
import { computeNbPlaces } from "@/app/utils/structure.util";

const StructuresMap = ({ structures }: Props): ReactElement => {
  return (
    <Map>
      {structures.map(
        (
          {
            coordinates,
            adresseOperateur,
            operateur,
            type,
            attachedStructures,
            typologie,
            id,
          },
          index
        ) => (
          <StructureMarker
            coordinates={coordinates}
            adresseOperateur={adresseOperateur}
            operateur={operateur}
            type={type}
            nbPlaces={computeNbPlaces(attachedStructures)}
            attachedStructures={attachedStructures}
            typologie={typologie}
            id={id}
            key={index}
          />
        )
      )}
    </Map>
  );
};

type Props = {
  structures: StructureAdministrative[];
};

export default StructuresMap;
