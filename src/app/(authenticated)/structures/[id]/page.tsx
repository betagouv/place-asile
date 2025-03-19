import { Structure } from "@/types/structure.type";
import { StructureHeader } from "./StructureHeader";
import { DescriptionBlock } from "./DescriptionBlock";
import { ReactElement } from "react";
import { CalendarBlock } from "./CalendarBlock";
import { TypePlaceBlock } from "./TypePlaceBlock";
import { ControlBlock } from "./ControlBlock";
import { getRepartition } from "@/app/utils/structure.util";

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
        dnaCode={structure.dnaCode}
        nom={structure.nom}
        commune={structure.communeAdministrative}
        departement={structure.departementAdministratif}
      />
      <div className="bg-grey fr-p-1w">
        <div className="fr-pb-1w">
          <DescriptionBlock
            creationDate={structure.creationDate}
            dnaCode={structure.dnaCode}
            operateur={structure.operateur}
            publicType={structure.public}
            adresse={structure.adresseAdministrative}
            nom={structure.nom}
            codePostal={structure.codePostalAdministratif}
            commune={structure.communeAdministrative}
            repartition={getRepartition(structure)}
            type={structure.type}
            finessCode={structure.finessCode}
            cpom={structure.cpom}
            lgbt={structure.lgbt}
            fvvTeh={structure.fvvTeh}
            contacts={structure.contacts || []}
            adresses={structure.adresses || []}
          />
        </div>
        <div className="fr-pb-1w">
          <CalendarBlock
            periodeAutorisationStart={structure.periodeAutorisationStart}
            periodeAutorisationEnd={structure.periodeAutorisationEnd}
            debutConvention={structure.debutConvention}
            finConvention={structure.finConvention}
            cpomStart={structure.cpomStart}
            cpomEnd={structure.cpomStart}
          />
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
