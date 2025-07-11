import { ReactElement } from "react";
import { Table } from "../../components/common/Table";
import { Pagination } from "../../components/common/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { RepartitionBadge } from "./RepartitionBadge";
import Link from "next/link";
import {
  getOperateurLabel,
  getPlacesByCommunes,
  getRepartition,
} from "@/app/utils/structure.util";
import { formatDate } from "@/app/utils/date.util";
import { Structure } from "@/types/structure.type";
import { EmptyCell } from "@/app/components/common/EmptyCell";

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
    return (
      <>
        <span>{mainCommune} </span>
        {mainCommune && Object.keys(mainCommune).length > 1 && (
          <span className="underline text-mention-grey inline-flex ms-1">
            + {Object.keys(mainCommune).length} autres
          </span>
        )}
      </>
    );
  };

  return (
    <div className="p-4 bg-grey h-full">
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
            <td>{getOperateurLabel(structure.filiale, structure.operateur)}</td>
            <td>{structure.nbPlaces}</td>
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
                title={`Détails de la structure ${structure.id}`}
                href={`structures/${structure.id}`}
              >
                Détails de la structure {structure.id}
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
