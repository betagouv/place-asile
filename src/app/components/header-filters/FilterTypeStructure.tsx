"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { FiltersTypesCheckbox } from "@/app/components/filters/FiltersTypesCheckbox";
import { useFilterNavigation } from "@/app/hooks/useFilterNavigation";
import { STRUCTURE_TYPES_DISPLAY_ORDER } from "@/types/structure.type";

export const FilterTypeStructure = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navigateWithFilter = useFilterNavigation();

  const urlTypes = searchParams.get("types")?.split(",").filter(Boolean);
  const currentTypes =
    urlTypes && urlTypes.length > 0 ? urlTypes : STRUCTURE_TYPES_DISPLAY_ORDER;

  const isAllChecked =
    currentTypes.length === STRUCTURE_TYPES_DISPLAY_ORDER.length;

  const updateUrl = (newTypes: string[]) => {
    navigateWithFilter(
      "types",
      newTypes.length < STRUCTURE_TYPES_DISPLAY_ORDER.length ? newTypes : [],
      { pathname, scroll: false }
    );
  };

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      updateUrl(STRUCTURE_TYPES_DISPLAY_ORDER);
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
      {STRUCTURE_TYPES_DISPLAY_ORDER.map((structureType) => (
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
