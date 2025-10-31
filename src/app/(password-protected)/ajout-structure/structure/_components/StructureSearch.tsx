import { ReactElement, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { DepartementAutocomplete } from "@/app/components/forms/DepartementAutocomplete";
import { OperateurAutocomplete } from "@/app/components/forms/OperateurAutocomplete";
import SelectWithValidation from "@/app/components/forms/SelectWithValidation";
import { StructureType } from "@/types/structure.type";
import { StructureOfiiType } from "@/types/structureOfii.type";

import { StructureOfiiList } from "./StructureOfiiList";

export const StructureSearch = (): ReactElement => {
  const parentFormContext = useFormContext();
  const { control, watch } = parentFormContext;

  const operateurId = watch("operateur.id");
  const departementNumero = watch("departement.numero");
  const type = watch("type");
  const structureOfii = watch("structureOfii");
  console.log(structureOfii);
  const [structuresOfii, setStructuresOfii] = useState<
    StructureOfiiType[] | undefined
  >(undefined);

  useEffect(() => {
    const fetchStructuresOfii = async () => {
      const structuresOfiiResponse = await fetch(
        `/api/structures-ofii?operateur=${operateurId}&departement=${departementNumero}&type=${type}`
      );
      const structuresOfii = await structuresOfiiResponse.json();
      setStructuresOfii(structuresOfii);
    };

    //if (operateurId && departementNumero && type) {
    fetchStructuresOfii();
    //}
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
