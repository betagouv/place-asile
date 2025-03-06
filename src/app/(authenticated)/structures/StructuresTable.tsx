import { ReactElement } from "react";
import { Table } from "../../components/common/Table";
import { Pagination } from "../../components/common/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { RepartitionBadge } from "./RepartitionBadge";
import Link from "next/link";
import { getPlacesByCommunes } from "@/app/utils/structure.util";
import { Structure } from "@/types/structure.type";

export const StructuresTable = ({
  structures,
  ariaLabelledBy,
}: Props): ReactElement => {
  const { currentPage, setCurrentPage, totalPages, currentData } =
    usePagination<Structure>(structures);

  const headings = [
    "Type",
    "Opérateur",
    "Places",
    "Répartition",
    "Commune",
    "Détails",
  ];

  const getCommuneLabel = (structure: Structure) => {
    const placesByCommune = getPlacesByCommunes(structure.logements || []);
    const mainCommune = Object.keys(placesByCommune)[0];
    return (
      <>
        <span>{mainCommune} </span>
        {Object.keys(mainCommune).length > 1 && (
          <span className="underline text-grey">
            + {Object.keys(mainCommune).length} autres
          </span>
        )}
      </>
    );
  };

  return (
    <div className="fr-p-1w bg-grey">
      <Table headings={headings} ariaLabelledBy={ariaLabelledBy}>
        {currentData.map((structure, index) => (
          <tr id={`table-row-key-${index}`} data-row-key={index} key={index}>
            <td>{structure.type}</td>
            <td>{structure.operateur}</td>
            <td>{structure.nbPlaces}</td>
            <td>
              <RepartitionBadge repartition={structure.repartition} />
            </td>
            <td>{getCommuneLabel(structure)}</td>
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
      <div className="align-center">
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
