import { FiltersBatis } from "./FiltersBatis";
import { FiltersPlacesAutorisees } from "./FiltersPlacesAutorisees";
import { FiltersTypes } from "./FiltersTypes";

export const FiltersPanel = () => {
  return (
    <div className="absolute top-full right-0 mt-1 w-96 bg-white rounded-md shadow-md">
      <FiltersTypes />
      <hr className="p-1!" />
      <FiltersBatis />
      <hr className="p-1!" />
      <FiltersPlacesAutorisees />
    </div>
  );
};
