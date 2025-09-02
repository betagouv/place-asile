import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import Link from "next/link";
import { ReactElement } from "react";

import { EmptyCell } from "@/app/components/common/EmptyCell";
import { formatDate } from "@/app/utils/date.util";
import {
  getOperateurLabel,
  getPlacesByCommunes,
  getRepartition,
} from "@/app/utils/structure.util";
import { Structure } from "@/types/structure.type";

import { Pagination } from "../../components/common/Pagination";
import { Table } from "../../components/common/Table";
import { usePagination } from "../../hooks/usePagination";
import { RepartitionBadge } from "./RepartitionBadge";

export const StructuresTable = ({
  structures,
  ariaLabelledBy,
}: Props): ReactElement => {
  const { currentPage, setCurrentPage, totalPages, currentData } =
    usePagination<Structure>(structures);

  const headings = [
    "DNA",
    "Type",
    "Opérateur",
    "Places aut.",
    "Bâti",
    "Communes",
    "Convention en cours",
    "Détails",
  ];

  const getCommuneLabel = (structure: Structure) => {
    const placesByCommune = getPlacesByCommunes(structure.adresses || []);
    const mainCommune = Object.keys(placesByCommune)[0];
    const communesWithoutMainCommune = Object.keys(placesByCommune).filter(
      (commune) => commune !== mainCommune
    );
    return (
      <>
        <span>{mainCommune} </span>
        {mainCommune && communesWithoutMainCommune.length > 1 && (
          <span className="underline text-mention-grey inline-flex ms-1">
            <Tooltip title={communesWithoutMainCommune.join(", ")}>
              + {communesWithoutMainCommune.length} autres
            </Tooltip>
          </span>
        )}
      </>
    );
  };

  return (
    <div className="p-4 bg-alt-grey h-full">
      <Table
        headings={headings}
        ariaLabelledBy={ariaLabelledBy}
        className="[&_tr]:!bg-transparent"
      >
        {currentData.map((structure, index) => (
          <tr
            id={`table-row-key-${index}`}
            data-row-key={index}
            key={index}
            className="border-t-1 border-default-grey"
          >
            <td>{structure.dnaCode}</td>
            <td>{structure.type}</td>
            <td>{getOperateurLabel(structure.filiale, structure.operateur?.name)}</td>
            <td>{structure.structureTypologies?.[0].placesAutorisees}</td>
            <td>
              <RepartitionBadge repartition={getRepartition(structure)} />
            </td>
            <td>{getCommuneLabel(structure)}</td>
            {structure.debutConvention && structure.finConvention ? (
              <td>
                {formatDate(structure.debutConvention)} -{" "}
                {formatDate(structure.finConvention)}
              </td>
            ) : (
              <EmptyCell />
            )}
            <td>
              <Link
                className="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-right-line"
                title={`Détails de la structure ${structure.dnaCode}`}
                href={`structures/${structure.id}`}
              >
                Détails de la structure {structure.dnaCode}
              </Link>
            </td>
          </tr>
        ))}
      </Table>
      <div className="pt-4 flex justify-center items-center">
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

type Props = {
  structures: Structure[];
  ariaLabelledBy: string;
};
