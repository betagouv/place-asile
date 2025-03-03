import { ReactElement } from "react";
import { Table } from "../../components/common/Table";
import { Pagination } from "../../components/common/Pagination";
import { Structure } from "../../../types/structure.type";
import { usePagination } from "../../hooks/usePagination";
import { TypologieBadge } from "./TypologieBadge";
import Link from "next/link";

export const StructuresTable = ({
  structures,
  ariaLabelledBy,
}: Props): ReactElement => {
  const { currentPage, setCurrentPage, totalPages, currentData } =
    usePagination<Structure>(structures);

  const headings = [
    "Type",
    "Opérateur",
    "Adresse administrative",
    "Répartition",
    "Places",
    "Détails",
  ];

  return (
    <div className="fr-p-1w bg-grey">
      <Table headings={headings} ariaLabelledBy={ariaLabelledBy}>
        {currentData.map((structure, index) => (
          <tr id={`table-row-key-${index}`} data-row-key={index} key={index}>
            <td className="text-grey">{structure.type}</td>
            <td>{structure.operateur}</td>
            <td className="text-grey">
              {structure.adresseHebergement}, {structure.codePostalHebergement}{" "}
              {structure.communeHebergement}
            </td>
            <td>
              <TypologieBadge typologie={structure.typologie} />
            </td>
            <td className="text-grey">{structure.nbPlaces}</td>
            <td className="text-grey">
              <Link
                className="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-right-line"
                title={`Détails de ${structure.adresseHebergement}`}
                href={`structures/${structure.id}`}
              >
                Détails de {structure.adresseHebergement}
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
