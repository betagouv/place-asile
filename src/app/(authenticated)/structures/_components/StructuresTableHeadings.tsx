"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactElement, useEffect, useRef, useState } from "react";

import { Table } from "@/app/components/common/Table";
import { StructureColumn } from "@/types/StructureColumn.type";

import { OrderButton } from "./OrderButton";

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
        <th scope="col" key="dna">
          <span className="flex items-center">
            DNA
            <OrderButton
              column="dnaCode"
              currentColumn={column}
              currentDirection={direction}
              handleOrdering={handleOrdering}
            />
          </span>
        </th>,
        <th scope="col" key="type">
          <span className="flex items-center">
            Type
            <OrderButton
              column="type"
              currentColumn={column}
              currentDirection={direction}
              handleOrdering={handleOrdering}
            />
          </span>
        </th>,
        <th scope="col" key="operateur" className="flex items-center">
          <span className="flex items-center">
            Opérateur
            <OrderButton
              column="operateur"
              currentColumn={column}
              currentDirection={direction}
              handleOrdering={handleOrdering}
            />
          </span>
        </th>,
        <th scope="col" key="departement">
          <span className="flex items-center justify-center">
            Dépt.
            <OrderButton
              column="departementAdministratif"
              currentColumn={column}
              currentDirection={direction}
              handleOrdering={handleOrdering}
            />
          </span>
        </th>,
        <th scope="col" key="bati">
          <span className="flex items-center">
            Bâti
            <OrderButton
              column="bati"
              currentColumn={column}
              currentDirection={direction}
              handleOrdering={handleOrdering}
            />
          </span>
        </th>,
        <th scope="col" key="communes">
          <span className="flex items-center">Communes</span>
        </th>,
        <th scope="col" key="placesAutorisees">
          <span className="flex items-center justify-center">
            Places aut.
            <OrderButton
              column="placesAutorisees"
              currentColumn={column}
              currentDirection={direction}
              handleOrdering={handleOrdering}
            />
          </span>
        </th>,
        <th scope="col" key="finConvention">
          <span className="flex items-center">
            Fin convention
            <OrderButton
              column="finConvention"
              currentColumn={column}
              currentDirection={direction}
              handleOrdering={handleOrdering}
            />
          </span>
        </th>,
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
