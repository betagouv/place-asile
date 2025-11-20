import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { StructureType } from "@/types/structure.type";

import { FiltersTypesCheckbox } from "./FiltersTypesCheckbox";

export const FiltersTypes = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState(searchParams.get("type")?.split(",") || []);

  const noTypeSelected = type.length === 0;

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (noTypeSelected) {
      const everyTypes: StructureType[] = [
        StructureType.CADA,
        StructureType.CPH,
        StructureType.HUDA,
        StructureType.CAES,
        StructureType.PRAHDA,
      ];
      setType(everyTypes.filter((structureType) => structureType !== value));
      return;
    }
    if (type.includes(value)) {
      setType(type.filter((structureType) => structureType !== value));
    } else {
      if (type.length >= 4) {
        setType([]);
      } else {
        setType([...type, value]);
      }
    }
  };

  const prevType = useRef(type);
  useEffect(() => {
    if (prevType.current !== type) {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("type", type.join(","));
      router.replace(`?${params.toString()}`);
      prevType.current = type;
    }
  }, [type, searchParams, router]);

  return (
    <div className="p-4">
      <fieldset>
        <legend className="text-title-blue-france text-sm font-medium mb-4">
          Type de structure
        </legend>
        <div className="grid grid-cols-3 gap-x-3 gap-y-2">
          <FiltersTypesCheckbox
            label="CADA"
            value={StructureType.CADA}
            checked={type.includes(StructureType.CADA) || noTypeSelected}
            onChange={handleTypeChange}
          />
          <FiltersTypesCheckbox
            label="CPH"
            value={StructureType.CPH}
            checked={type.includes(StructureType.CPH) || noTypeSelected}
            onChange={handleTypeChange}
          />
          <FiltersTypesCheckbox
            label="HUDA"
            value={StructureType.HUDA}
            checked={type.includes(StructureType.HUDA) || noTypeSelected}
            onChange={handleTypeChange}
          />
          <FiltersTypesCheckbox
            label="CAES"
            value={StructureType.CAES}
            checked={type.includes(StructureType.CAES) || noTypeSelected}
            onChange={handleTypeChange}
          />
          <FiltersTypesCheckbox
            label="PRAHDA"
            value={StructureType.PRAHDA}
            checked={type.includes(StructureType.PRAHDA) || noTypeSelected}
            onChange={handleTypeChange}
          />
        </div>
      </fieldset>
    </div>
  );
};
