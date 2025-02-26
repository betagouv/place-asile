import { ReactElement } from "react";
import { Table } from "../../components/common/Table";
import { Pagination } from "../../components/common/Pagination";
import { Centre } from "../../../types/centre.type";
import { usePagination } from "../../hooks/usePagination";
import { TypologieBadge } from "./TypologieBadge";
import Link from "next/link";

export const CentresTable = ({
  centres,
  ariaLabelledBy,
}: Props): ReactElement => {
  const { currentPage, setCurrentPage, totalPages, currentData } =
    usePagination<Centre>(centres);

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
        {currentData.map((centre, index) => (
          <tr id={`table-row-key-${index}`} data-row-key={index} key={index}>
            <td className="text-grey">{centre.type}</td>
            <td>{centre.operateur}</td>
            <td className="text-grey">
              {centre.adresseHebergement}, {centre.codePostalHebergement}{" "}
              {centre.communeHebergement}
            </td>
            <td>
              <TypologieBadge typologie={centre.typologie} />
            </td>
            <td className="text-grey">{centre.nbPlaces}</td>
            <td className="text-grey">
              <Link
                className="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-right-line"
                title={`Détails de ${centre.adresseHebergement}`}
                href={`centres/${centre.id}`}
              >
                Détails de {centre.adresseHebergement}
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
  centres: Centre[];
  ariaLabelledBy: string;
};
