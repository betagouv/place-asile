import { PropsWithChildren, ReactElement } from "react";

export const Table = ({
  children,
  title,
  headings,
  ariaLabelledBy,
}: Props): ReactElement => {
  return (
    <div className="w-full bg-lifted-grey border-1 border-default-grey rounded-lg">
      <table aria-labelledby={ariaLabelledBy} className="w-full">
        {title && <caption>{title}</caption>}
        <thead>
          <tr>
            {headings.map((heading) => (
              <th
                scope="col"
                key={`col-${heading}`}
                className="uppercase text-mention-grey py-4 px-5 text-center text-xs"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&>tr>td]:py-2 [&>tr>td]:px-4 [&>tr>td]:text-center [&>tr>td]:text-sm">
          {children}
        </tbody>
      </table>
    </div>
  );
};

type Props = PropsWithChildren<{
  title?: string;
  headings: string[];
  ariaLabelledBy: string;
}>;
