import { Structure } from "@/types/structure.type";
import { StructureHeader } from "./StructureHeader";
import { DescriptionBlock } from "./DescriptionBlock";
import { ReactElement } from "react";

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
        adresse={structure.adresseHebergement}
        codePostal={structure.codePostalHebergement}
        commune={structure.communeHebergement}
      />
      <div className="bg-grey fr-p-1w">
        <DescriptionBlock
          nbPlaces={structure.nbPlaces}
          nbHebergements={structure.nbHebergements}
          typologie={structure.typologie}
        />
      </div>
    </>
  );
}

type Params = {
  params: Promise<{ id: number }>;
};
