import { Button } from "@codegouvfr/react-dsfr/Button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Repartition } from "@/types/adresse.type";
import { StructureType } from "@/types/structure.type";

import { FiltersPanel } from "./FiltersPanel";

export const Filters = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [isActive, setIsActive] = useState(false);

  const searchParams = useSearchParams();
  const search: string | null = searchParams.get("search");
  const type: StructureType | null = searchParams.get(
    "type"
  ) as StructureType | null;
  const bati: Repartition | null = searchParams.get(
    "bati"
  ) as Repartition | null;
  const places: string | null = searchParams.get("places");
  const departements: string | null = searchParams.get("departements");

  useEffect(() => {
    if (search || type || bati || places || departements) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [search, type, bati, places, departements]);

  return (
    <div className="relative">
      <Button
        priority="tertiary"
        size="small"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="fr-icon-filter-line fr-icon--sm relative">
          {isActive && (
            <span className="absolute block rounded-full w-1.5 h-1.5 bg-border-action-high-warning top-0 right-0" />
          )}
        </span>{" "}
        Filtres
      </Button>
      {isOpen && <FiltersPanel setIsOpen={setIsOpen} />}
    </div>
  );
};
