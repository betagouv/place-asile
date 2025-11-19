import { Button } from "@codegouvfr/react-dsfr/Button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Repartition } from "@/types/adresse.type";
import { StructureType } from "@/types/structure.type";

import { FiltersPanel } from "./FiltersPanel";
import { LocationFiltersPanel } from "./LocationFiltersPanel";

export const Filters = () => {
  const [openPanel, setOpenPanel] = useState<
    "filters" | "localisation" | undefined
  >("localisation");

  const handleTogglePanel = (panel: "filters" | "localisation" | undefined) => {
    if (openPanel === panel) {
      setOpenPanel(undefined);
    } else {
      setOpenPanel(panel);
    }
  };

  const [isFiltersActive, setIsFiltersActive] = useState(false);
  const [isLocationActive, setIsLocationActive] = useState(false);

  const searchParams = useSearchParams();
  const type: StructureType | null = searchParams.get(
    "type"
  ) as StructureType | null;
  const bati: Repartition | null = searchParams.get(
    "bati"
  ) as Repartition | null;
  const places: string | null = searchParams.get("places");

  useEffect(() => {
    if (type || bati || places) {
      setIsFiltersActive(true);
    } else {
      setIsFiltersActive(false);
    }
  }, [type, bati, places]);

  const departements: string | null = searchParams.get("departements");

  useEffect(() => {
    if (departements) {
      setIsLocationActive(true);
    } else {
      setIsLocationActive(false);
    }
  }, [departements]);

  useEffect(() => {
    if (!openPanel) return;

    const handleClickOutside = (event: MouseEvent) => {
      const filtersPanel = document.getElementById("filters-panel");
      const locationPanel = document.getElementById("location-panel");
      let clickedInsidePanel = false;

      if (
        (filtersPanel && filtersPanel.contains(event.target as Node)) ||
        (locationPanel && locationPanel.contains(event.target as Node))
      ) {
        clickedInsidePanel = true;
      }

      if (!clickedInsidePanel) {
        setOpenPanel(undefined);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPanel]);

  return (
    <>
      <div className="relative">
        <Button
          priority="tertiary"
          size="small"
          onClick={() => handleTogglePanel("filters")}
          className="flex gap-1"
        >
          <span className="fr-icon-filter-line fr-icon--sm relative">
            {isFiltersActive && (
              <span className="absolute block rounded-full w-1.5 h-1.5 bg-border-action-high-warning top-0 right-0" />
            )}
          </span>{" "}
          Filtres
        </Button>
        {openPanel === "filters" && (
          <FiltersPanel
            closePanel={() => handleTogglePanel(undefined)}
            isActive={isFiltersActive}
          />
        )}
      </div>{" "}
      <div className="relative">
        <Button
          priority="tertiary"
          size="small"
          onClick={() => handleTogglePanel("localisation")}
          className="flex gap-1"
        >
          <span className="fr-icon-focus-3-line fr-icon--sm relative">
            {isLocationActive && (
              <span className="absolute block rounded-full w-1.5 h-1.5 bg-border-action-high-warning top-0 right-0" />
            )}
          </span>{" "}
          Région / Département
        </Button>
        {openPanel === "localisation" && (
          <LocationFiltersPanel
            closePanel={() => handleTogglePanel(undefined)}
            isActive={isLocationActive}
          />
        )}
      </div>
    </>
  );
};
