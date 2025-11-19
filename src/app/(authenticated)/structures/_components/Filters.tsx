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

  const [isActive, setIsActive] = useState(false);

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
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [type, bati, places]);

  const departements: string | null = searchParams.get("departements");

  useEffect(() => {
    if (departements) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [departements]);

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
            {isActive && (
              <span className="absolute block rounded-full w-1.5 h-1.5 bg-border-action-high-warning top-0 right-0" />
            )}
          </span>{" "}
          Filtres
        </Button>
        {openPanel === "filters" && (
          <FiltersPanel closePanel={() => handleTogglePanel(undefined)} />
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
            {isActive && (
              <span className="absolute block rounded-full w-1.5 h-1.5 bg-border-action-high-warning top-0 right-0" />
            )}
          </span>{" "}
          Région / Département
        </Button>
        {openPanel === "localisation" && (
          <LocationFiltersPanel
            closePanel={() => handleTogglePanel(undefined)}
          />
        )}
      </div>
    </>
  );
};
