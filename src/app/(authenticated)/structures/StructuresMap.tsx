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
          },
          index
        ) => (
          <StructureMarker
            id={id}
            dnaCode={dnaCode}
            coordinates={coordinates}
            operateur={operateur}
            type={type}
            nbPlaces={nbPlaces}
            repartition={repartition}
            nom={nom}
            commune={commune}
            codePostal={codePostal}
            departement={departement}
            logements={logements || []}
            debutConvention={debutConvention}
            finConvention={finConvention}
            qpv={qpv}
            cpom={cpom}
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
