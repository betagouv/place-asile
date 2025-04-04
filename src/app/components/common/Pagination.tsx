import { ReactElement } from "react";

export const Pagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
}: Props): ReactElement => {
  return (
    <nav role="navigation" className="fr-pagination" aria-label="Pagination">
      <ul className="fr-pagination__list">
        <li>
          <a
            className="fr-pagination__link fr-pagination__link--first"
            href={currentPage === 0 ? undefined : "#"}
            aria-disabled={currentPage === 0}
            role="link"
            onClick={() => setCurrentPage(0)}
          >
            Première page
          </a>
        </li>
        <li>
          <a
            className="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
            href={currentPage - 1 < 0 ? undefined : "#"}
            aria-disabled={currentPage - 1 >= 0}
            role="link"
            onClick={() =>
              currentPage - 1 >= 0 && setCurrentPage(currentPage - 1)
            }
          >
            Page précédente
          </a>
        </li>
        <li>
          <a
            className="fr-pagination__link"
            role="link"
            href="#"
            title={`Page ${currentPage + 1}/${totalPages + 1}`}
          >
            Page {currentPage + 1}/{totalPages + 1}
          </a>
        </li>
        <li>
          <a
            className="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
            role="link"
            href={currentPage + 1 > totalPages ? undefined : "#"}
            aria-disabled={currentPage + 1 <= totalPages}
            onClick={() =>
              currentPage + 1 <= totalPages && setCurrentPage(currentPage + 1)
            }
          >
            Page suivante
          </a>
        </li>
        <li>
          <a
            className="fr-pagination__link fr-pagination__link--last"
            role="link"
            href={currentPage >= totalPages ? undefined : "#"}
            aria-disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            Dernière page
          </a>
        </li>
      </ul>
    </nav>
  );
};

type Props = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
};
