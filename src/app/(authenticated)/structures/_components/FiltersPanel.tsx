import { FiltersBatis } from "./FiltersBatis";
import { FiltersPlacesAutorisees } from "./FiltersPlacesAutorisees";
import { FiltersResetter } from "./FiltersResetter";
import { FiltersTypes } from "./FiltersTypes";

export const FiltersPanel = ({ closePanel, isActive, ref }: Props) => {
  return (
    <div
      ref={ref}
      className="absolute top-full -right-2 mt-1 w-96 bg-white rounded-md shadow-md"
    >
      <FiltersTypes />
      <hr className="p-1!" />
      <FiltersBatis />
      <hr className="p-1!" />
      <FiltersPlacesAutorisees />
      <hr className="p-1!" />
      <FiltersResetter closePanel={closePanel} isActive={isActive} />
    </div>
  );
};

type Props = {
  closePanel: () => void;
  isActive: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
};
