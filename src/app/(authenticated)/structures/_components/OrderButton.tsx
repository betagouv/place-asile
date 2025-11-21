import Button from "@codegouvfr/react-dsfr/Button";
import { ReactElement } from "react";

import { cn } from "@/app/utils/classname.util";
import { StructureColumn } from "@/types/StructureColumn.type";

export const OrderButton = ({
  column,
  currentColumn,
  currentDirection,
  handleOrdering,
}: Props): ReactElement => {
  return (
    <Button
      priority="tertiary no outline"
      onClick={() => handleOrdering(column)}
      className="relative"
      size="small"
      aria-label={`Ordonner par ${column}`}
    >
      <span
        className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 fr-icon-arrow-up-s-line text-disabled-grey",
          column === currentColumn && currentDirection === "asc"
            ? "text-title-blue-france"
            : "text-disabled-grey fr-icon--sm"
        )}
      />
      <span
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 fr-icon-arrow-down-s-line text-disabled-grey",
          column === currentColumn && currentDirection === "desc"
            ? "text-title-blue-france"
            : "text-disabled-grey fr-icon--sm"
        )}
      />
    </Button>
  );
};

type Props = {
  column: StructureColumn;
  currentColumn: StructureColumn | null;
  currentDirection: "asc" | "desc" | null;
  handleOrdering: (column: StructureColumn) => void;
};
