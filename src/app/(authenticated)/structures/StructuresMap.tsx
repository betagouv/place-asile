"use client";

import { ReactElement } from "react";
import { StructureMarker } from "./StructureMarker";
import { Structure } from "../../../types/structure.type";
import { Map } from "../../components/map/Map";
import { getRepartition } from "@/app/utils/structure.util";

const StructuresMap = ({ structures }: Props): ReactElement => {
  return (
    <Map>
      {structures.map((structure) => (
        <StructureMarker
          id={structure.id}
          dnaCode={structure.dnaCode}
          coordinates={structure.coordinates}
          operateur={structure.operateur}
          filiale={structure.filiale}
          type={structure.type}
          nbPlaces={structure.nbPlaces}
          repartition={getRepartition(structure)}
          nom={structure.nom}
          commune={structure.communeAdministrative}
          codePostal={structure.codePostalAdministratif}
          departement={structure.departementAdministratif}
          adresses={structure.adresses || []}
          debutConvention={structure.debutConvention}
          finConvention={structure.finConvention}
          key={structure.id}
        />
      ))}
    </Map>
  );
};

type Props = {
  structures: Structure[];
};

export default StructuresMap;
