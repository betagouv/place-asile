import { Button } from "@codegouvfr/react-dsfr/Button";
import { useState } from "react";

import { FiltersPanel } from "./FiltersPanel";

export const Filters = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button priority="tertiary" size="small" onClick={() => setOpen(!open)}>
        <span className="fr-icon-filter-line fr-icon--sm"></span> Filtres
      </Button>
      {open && <FiltersPanel />}
    </div>
  );
};
