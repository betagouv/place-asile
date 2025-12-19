import { StructureTypologieApiType } from "@/schemas/api/structure-typologie.schema";

export const createStructureTypologie = ({
  year,
  ...props
}: Props = {}): StructureTypologieApiType => {
  return {
    id: 1,
    year: year ?? 2023,
    fvvTeh: 5,
    lgbt: 4,
    placesAutorisees: 10,
    pmr: 3,
    placesACreer: 1,
    placesAFermer: 2,
    echeancePlacesACreer: new Date("01/02/2026").toISOString(),
    echeancePlacesAFermer: new Date("01/02/2027").toISOString(),
    ...props,
  };
};

type Props = {
  year?: number;
} & Partial<StructureTypologieApiType>;
