import React, { ReactElement } from "react";
import { Table } from "./common/Table";
import { Pagination } from "./common/Pagination";
import { Centre } from "../types/centre.type";

export const CentresTable = ({ centres }: Props): ReactElement => {
  const headings = [
    { label: "Type", selector: "type" },
    { label: "Opérateur", selector: "operateur" },
    { label: "Adresse administrative", selector: "adresseHebergement" },
    { label: "Répartition", selector: "typologie" },
    { label: "Places", selector: "nbPlaces" },
  ];

  const TypedTable = Table<Centre>;

  return (
    <>
      <TypedTable data={centres} headings={headings} />
      <Pagination />
    </>
  );
};

type Props = {
  centres: Centre[];
};
