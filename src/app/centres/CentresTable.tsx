import { ReactElement } from "react";
import { Table } from "../components/Table";
import { Pagination } from "../components/Pagination";
import { Centre } from "../../types/centre.type";
import { Badge } from "../components/Badge";
import { usePagination } from "../hooks/usePagination";

export const CentresTable = ({
  centres,
  ariaLabelledBy,
}: Props): ReactElement => {
  const { currentPage, setCurrentPage, totalPages, currentData } =
    usePagination<Centre>(centres);

  const headings = [
    { label: "Type", selector: "type" },
    { label: "Opérateur", selector: "operateur" },
    { label: "Adresse administrative", selector: "adresseHebergement" },
    { label: "Répartition", selector: "typologie" },
    { label: "Places", selector: "nbPlaces" },
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
              <Badge>{centre.typologie}</Badge>
            </td>
            <td className="text-grey">{centre.nbPlaces}</td>
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
