import React, { ReactElement, ReactNode } from "react";

export function Table<DataType extends Record<string, ReactNode>>({
  data,
  title,
  headings,
}: Props<DataType>): ReactElement {
  return (
    <div className="fr-table fr-mt-0" id="table-md-component">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table id="table-md">
              {title && <caption>{title}</caption>}
              <thead>
                <tr>
                  {headings.map((heading) => (
                    <th scope="col" key={`col-${heading.selector}`}>
                      {heading.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr
                    id={`table-md-row-key-${rowIndex}`}
                    data-row-key={rowIndex}
                    key={`row-${rowIndex}`}
                  >
                    {Object.values(headings).map((heading, cellIndex) => (
                      <td key={`cell-${rowIndex}-${cellIndex}`}>
                        {row[heading.selector]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

type Props<DataType> = {
  data: DataType[];
  title?: string;
  headings: { label: string; selector: string }[];
};
