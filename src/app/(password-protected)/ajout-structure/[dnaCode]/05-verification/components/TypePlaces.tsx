import { useParams } from "next/navigation";

import { Table } from "@/app/components/common/Table";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { getTypePlacesYearRange } from "@/app/utils/date.util";
import { AjoutTypePlacesFormValues } from "@/schemas/forms/ajout/ajoutTypePlaces.schema";

export const TypePlaces = () => {
  const params = useParams();
  const { currentValue: localStorageValues } = useLocalStorage<
    Partial<AjoutTypePlacesFormValues>
  >(`ajout-structure-${params.dnaCode}-type-places`, {});

  const { years } = getTypePlacesYearRange();

  return (
    <Table
      headings={["Année", "Autorisées", "PMR", "LGBT", "FVV/TEH"]}
      ariaLabelledBy=""
      className="[&_th]:px-0 text-center w-1/3"
    >
      {years.map((year, index) => (
        <tr
          key={year}
          className="w-full [&_input]:max-w-16 border-t border-default-grey "
        >
          <td className="align-middle py-4">{year}</td>
          <td className="py-4!">
            {localStorageValues?.typologies?.[index]?.placesAutorisees}
          </td>
          <td className="py-1!">
            {localStorageValues?.typologies?.[index]?.pmr}
          </td>
          <td className="py-1!">
            {localStorageValues?.typologies?.[index]?.lgbt}
          </td>
          <td className="py-1!">
            {localStorageValues?.typologies?.[index]?.fvvTeh}
          </td>
        </tr>
      ))}
    </Table>
  );
};
