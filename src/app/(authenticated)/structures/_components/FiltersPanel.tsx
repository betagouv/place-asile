import { FiltersBatis } from "./FiltersBatis";
import { FiltersPlacesAutorisees } from "./FiltersPlacesAutorisees";
import { FiltersReinitializer } from "./FiltersReinitializer";
import { FiltersTypes } from "./FiltersTypes";

export const FiltersPanel = ({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) => {
  return (
    <div className="absolute top-full right-0 mt-1 w-96 bg-white rounded-md shadow-md">
      <FiltersTypes />
      <hr className="p-1!" />
      <FiltersBatis />
      <hr className="p-1!" />
      <FiltersPlacesAutorisees />
      <hr className="p-1!" />
      <FiltersReinitializer setIsOpen={setIsOpen} />
    </div>
  );
};
