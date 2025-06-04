import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { TypePlacesSchema } from "../../../validation/validation";
import { useParams } from "next/navigation";
import { z } from "zod";
import { Table } from "@/app/components/common/Table";
import { useMemo } from "react";

type TypePlacesFormValues = z.infer<typeof TypePlacesSchema>;
export const TypePlaces = () => {
  const params = useParams();
  const { currentValue: localStorageValues } = useLocalStorage<
    Partial<TypePlacesFormValues>
  >(`ajout-structure-${params.dnaCode}-type-places`, {});

  const years = useMemo(() => [2025, 2024, 2023] as const, []);

  return (
    <Table
      headings={["Année", "Autorisées", "PMR", "LGBT", "FVV/TEH"]}
      ariaLabelledBy=""
      className="[&_th]:px-0 text-center w-1/3"
    >
      {years.map((year, index) => (
        <tr
          key={year}
          className="w-full [&_input]:max-w-[4rem] border-t border-default-grey "
        >
          <td className="align-middle py-4">{year}</td>
          <td className="!py-4">
            {localStorageValues?.typologies?.[index]?.autorisees}
          </td>
          <td className="!py-1">
            {localStorageValues?.typologies?.[index]?.pmr}
          </td>
          <td className="!py-1">
            {localStorageValues?.typologies?.[index]?.lgbt}
          </td>
          <td className="!py-1">
            {localStorageValues?.typologies?.[index]?.fvvTeh}
          </td>
        </tr>
      ))}
    </Table>
  );
};
