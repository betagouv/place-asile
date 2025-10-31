import { ReactElement, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { DepartementAutocomplete } from "@/app/components/forms/DepartementAutocomplete";
import { OperateurAutocomplete } from "@/app/components/forms/OperateurAutocomplete";
import SelectWithValidation from "@/app/components/forms/SelectWithValidation";
import { StructureType } from "@/types/structure.type";
import { StructureOfiiType } from "@/types/structureOfii.type";

import { StructureOfiiList } from "./StructureOfiiList";

async function getStructuresOfii(
  operateurId: string,
  departementNumero: string,
  type: string
): Promise<StructureOfiiType[]> {
  try {
    // Use NEXT_URL instead of NEXT_PUBLIC_BASE_URL
    const baseUrl = process.env.NEXT_URL || "";
    const result = await fetch(
      `${baseUrl}/api/structures-ofii?operateur=${operateurId}&departement=${departementNumero}&type=${type}`,
      {
        cache: "no-store",
      }
    );

    if (!result.ok) {
      throw new Error(`Failed to fetch structure: ${result.status}`);
    }

    return await result.json();
  } catch (error) {
    console.error("Error fetching structure:", error);
    return [];
  }
}

export const StructureSearch = (): ReactElement => {
  const parentFormContext = useFormContext();
  const { control, watch } = parentFormContext;

  const operateurId = watch("operateur.id");
  const departementNumero = watch("departement.numero");
  const type = watch("type");

  const [structuresOfii, setStructuresOfii] = useState<
    StructureOfiiType[] | undefined
  >(undefined);

  useEffect(() => {
    const fetchStructuresOfii = async () => {
      const structuresOfii = await getStructuresOfii(
        operateurId,
        departementNumero,
        type
      );
      setStructuresOfii(structuresOfii);
    };

    if (operateurId && departementNumero && type) {
      fetchStructuresOfii();
    }
  }, [operateurId, departementNumero, type]);

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="grid grid-cols-3 gap-6 mb-2">
        <SelectWithValidation
          name="type"
          control={control}
          label="Type de structure"
          required
          id="type"
        >
          <option value="">Sélectionnez un type</option>
          {Object.values(StructureType)
            .filter((structureType) => structureType !== StructureType.PRAHDA)
            .map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
        </SelectWithValidation>
        <OperateurAutocomplete />
        <DepartementAutocomplete />
      </div>
      <StructureOfiiList structuresOfii={structuresOfii} control={control} />
    </div>
  );
};
