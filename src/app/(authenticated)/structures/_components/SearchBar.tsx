import { ChangeEvent, ReactElement } from "react";

import { StructureApiType } from "@/schemas/api/structure.schema";

export const SearchBar = ({
  structures,
  setFilteredStructures,
}: Props): ReactElement => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm.length > 0) {
      const filteredStructures = structures.filter((structure) => {
        const communes =
          structure.adresses?.flatMap(
            (adresse) => adresse.commune?.toLowerCase() ?? []
          ) || [];
        const matchesDnaCode = structure.dnaCode
          .toLowerCase()
          .includes(searchTerm);
        const matchesCommune = communes.some((commune) =>
          commune.includes(searchTerm)
        );
        return matchesDnaCode || matchesCommune;
      });
      setFilteredStructures(filteredStructures);
    }
  };

  return (
    <div className="border border-disabled-grey h-8 flex items-center">
      <span className="fr-icon-search-line fr-icon--sm text-label-blue-france px-2" />
      <input
        type="text"
        placeholder="DNA ou commune"
        id="search"
        onChange={onChange}
      />
    </div>
  );
};

type Props = {
  structures: StructureApiType[];
  setFilteredStructures: (filteredStructures: StructureApiType[]) => void;
};
