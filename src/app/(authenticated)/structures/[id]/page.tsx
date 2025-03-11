import { Structure } from "@/types/structure.type";
import { StructureHeader } from "./StructureHeader";
import { DescriptionBlock } from "./DescriptionBlock";
import { ReactElement } from "react";
import { CalendarBlock } from "./CalendarBlock";
import { TypePlaceBlock } from "./TypePlaceBlock";
import { ControlBlock } from "./ControlBlock";

export default async function StructureDetails({
  params,
}: Params): Promise<ReactElement> {
  const { id } = await params;
  const result = await fetch(`${process.env.NEXT_URL}/api/structures/${id}`);
  const structure: Structure = await result.json();

  return (
    <>
      <StructureHeader
        type={structure.type}
        operateur={structure.operateur}
        nbPlaces={structure.nbPlaces}
        nom={structure.nom}
        commune={structure.commune}
        departement={structure.departement}
      />
      <div className="bg-grey fr-p-1w">
        <div className="fr-pb-1w">
          <DescriptionBlock
            creationDate={structure.creationDate}
            dnaCode={structure.dnaCode}
            operateur={structure.operateur}
            publicType={structure.public}
            adresse={structure.adresse}
            nom={structure.nom}
            codePostal={structure.codePostal}
            commune={structure.commune}
            repartition={structure.repartition}
            type={structure.type}
            finessCode={structure.finessCode}
            cpom={structure.cpom}
            lgbt={structure.lgbt}
            fvvTeh={structure.fvvTeh}
            contacts={structure.contacts || []}
            logements={structure.logements || []}
          />
        </div>
        <div className="fr-pb-1w">
          <CalendarBlock />
        </div>
        <div className="fr-pb-1w">
          <TypePlaceBlock />
        </div>
        <div className="fr-pb-1w">
          <ControlBlock />
        </div>
      </div>
    </>
  );
}

type Params = {
  params: Promise<{ id: number }>;
};
