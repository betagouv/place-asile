import { Button } from "@codegouvfr/react-dsfr/Button";
import { useState } from "react";

import { FiltersPanel } from "./FiltersPanel";

export const Filters = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="relative">
      <Button
        priority="tertiary"
        size="small"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="fr-icon-filter-line fr-icon--sm"></span> Filtres
      </Button>
      {isOpen && <FiltersPanel />}
    </div>
  );
};
