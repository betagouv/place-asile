"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactElement, useEffect, useRef, useState } from "react";

import { Table } from "@/app/components/common/Table";
import { cn } from "@/app/utils/classname.util";
import { StructureColumn } from "@/types/StructureColumn.type";

import { OrderButton } from "./OrderButton";

const COLUMNS: {
  label: string;
  column: StructureColumn;
  orderBy: boolean;
  centered: boolean;
}[] = [
  {
    label: "DNA",
    column: "dnaCode",
    orderBy: true,
    centered: false,
  },
  {
    label: "Type",
    column: "type",
    orderBy: true,
    centered: false,
  },
  {
    label: "Opérateur",
    column: "operateur",
    orderBy: true,
    centered: false,
  },
  {
    label: "Dépt.",
    column: "departementAdministratif",
    orderBy: true,
    centered: true,
  },
  {
    label: "Bâti",
    column: "bati",
    orderBy: true,
    centered: false,
  },
  {
    label: "Communes",
    column: "communes",
    orderBy: false,
    centered: false,
  },
  {
    label: "Places aut.",
    column: "placesAutorisees",
    orderBy: true,
    centered: true,
  },
  {
    label: "Fin convention",
    column: "finConvention",
    orderBy: true,
    centered: false,
  },
];

export const StructuresTableHeadings = ({
  ariaLabelledBy,
  children,
}: Props): ReactElement => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [column, setColumn] = useState<StructureColumn | null>(
    searchParams.get("column") as StructureColumn | null
  );
  const [direction, setDirection] = useState<"asc" | "desc" | null>(
    searchParams.get("direction") as "asc" | "desc" | null
  );

  const handleOrdering = (newColumn: StructureColumn) => {
    if (newColumn === column) {
      if (direction === "asc") {
        setDirection("desc");
      } else {
        setDirection(null);
        setColumn(null);
      }
    } else {
      setColumn(newColumn);
      setDirection("asc");
    }
  };

  const prevColumn = useRef<StructureColumn | null>(null);
  const prevDirection = useRef<"asc" | "desc" | null>(null);

  useEffect(() => {
    if (prevColumn.current !== column || prevDirection.current !== direction) {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (column) {
        params.set("column", column);
      } else {
        params.delete("column");
      }
      if (direction) {
        params.set("direction", direction);
      } else {
        params.delete("direction");
      }
      router.replace(`?${params.toString()}`);
      prevColumn.current = column;
      prevDirection.current = direction;
    }
  }, [column, direction, searchParams, router]);

  return (
    <Table
      headings={[
        ...COLUMNS.map((columnToDisplay) => (
          <th scope="col" key={columnToDisplay.column}>
            <span
              className={cn(
                "flex items-center",
                columnToDisplay.centered && "justify-center"
              )}
            >
              {columnToDisplay.label}
              {columnToDisplay.orderBy && (
                <OrderButton
                  column={columnToDisplay.column}
                  currentColumn={column}
                  currentDirection={direction}
                  handleOrdering={handleOrdering}
                />
              )}
            </span>
          </th>
        )),
        "",
      ]}
      ariaLabelledBy={ariaLabelledBy}
      className="[&_thead_tr]:bg-transparent! [&_thead_tr_th]:text-left [&_thead_tr_th]:h-12"
    >
      {children}
    </Table>
  );
};

type Props = {
  ariaLabelledBy: string;
  children: ReactElement[];
};
