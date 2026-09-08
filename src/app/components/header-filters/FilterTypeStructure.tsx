"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { FiltersTypesCheckbox } from "@/app/components/filters/FiltersTypesCheckbox";
import { useFilterNavigation } from "@/app/hooks/useFilterNavigation";
import { ACCEPTED_STRUCTURE_TYPES } from "@/types/structure.type";

export const FilterTypeStructure = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navigateWithFilter = useFilterNavigation();

  const urlTypes = searchParams.get("types")?.split(",").filter(Boolean);
  const currentTypes =
    urlTypes && urlTypes.length > 0 ? urlTypes : ACCEPTED_STRUCTURE_TYPES;

  const isAllChecked = currentTypes.length === ACCEPTED_STRUCTURE_TYPES.length;

  const updateUrl = (newTypes: string[]) => {
    navigateWithFilter(
      "types",
      newTypes.length < ACCEPTED_STRUCTURE_TYPES.length ? newTypes : [],
      { pathname, scroll: false }
    );
  };

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      updateUrl(ACCEPTED_STRUCTURE_TYPES);
    } else {
      updateUrl([]);
    }
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (currentTypes.includes(value)) {
      updateUrl(currentTypes.filter((type) => type !== value));
    } else {
      updateUrl([...currentTypes, value]);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-2">
      <FiltersTypesCheckbox
        label="Tous les types"
        value="all"
        checked={isAllChecked}
        onChange={handleSelectAllChange}
      />
      {ACCEPTED_STRUCTURE_TYPES.map((structureType) => (
        <FiltersTypesCheckbox
          key={structureType}
          label={structureType}
          value={structureType}
          checked={currentTypes.includes(structureType)}
          onChange={handleTypeChange}
        />
      ))}
    </div>
  );
};
