import { PropsWithChildren, ReactElement } from "react";
import styles from "./Table.module.css";

export function Table({
  children,
  title,
  headings,
  ariaLabelledBy,
}: Props): ReactElement {
  return (
    <div
      className="fr-table fr-mt-0"
      id="table-md-component"
      aria-labelledby={ariaLabelledBy}
    >
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table id="table-md" className={styles.borders}>
              {title && <caption>{title}</caption>}
              <thead>
                <tr>
                  {headings.map((heading) => (
                    <th
                      scope="col"
                      key={`col-${heading}`}
                      className={`uppercase text-mention-grey ${styles["no-bg"]}`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{children}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = PropsWithChildren<{
  title?: string;
  headings: string[];
  ariaLabelledBy: string;
}>;
