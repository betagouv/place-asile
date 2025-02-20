import { Centre } from "@/types/centre.type";
import { CentreHeader } from "./CentreHeader";
import { DescriptionBlock } from "./DescriptionBlock";

export default async function CentreDetails({ params }: Params) {
  const { id } = await params;
  const result = await fetch(`${process.env.URL}/api/centres/${id}`);
  const centre: Centre = await result.json();

  return (
    <>
      <CentreHeader
        type={centre.type}
        operateur={centre.operateur}
        adresse={centre.adresseHebergement}
        codePostal={centre.codePostalHebergement}
        commune={centre.communeHebergement}
      />
      <div className="bg-grey fr-p-1w">
        <DescriptionBlock
          nbPlaces={centre.nbPlaces}
          nbHebergements={centre.nbHebergements}
          typologie={centre.typologie}
        />
      </div>
    </>
  );
}

type Params = {
  params: { id: number };
};
