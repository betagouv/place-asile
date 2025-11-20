import { FiltersDepartement } from "./FiltersDepartement";
import { FiltersResetter } from "./FiltersResetter";

export const LocationFiltersPanel = ({ closePanel, isActive, ref }: Props) => {
  return (
    <div
      ref={ref}
      className="absolute top-full -right-2 mt-1 w-80 bg-white rounded-md shadow-md"
    >
      <FiltersDepartement />
      <hr className="p-1!" />
      <FiltersResetter
        closePanel={closePanel}
        label="Réinitialiser (toute la France)"
        filters={["departements"]}
        isActive={isActive}
      />
    </div>
  );
};

type Props = {
  closePanel: () => void;
  isActive: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
};
