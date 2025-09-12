import { Fragment, PropsWithChildren, ReactElement, useRef } from "react";

import { cn } from "@/app/utils/classname.util";

export const Table = ({
  children,
  title,
  headings,
  preHeadings,
  ariaLabelledBy,
  className,
  enableBorders,
  hasErrors,
}: Props) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const renderCountRef = useRef(0);

  renderCountRef.current += 1;
  // TODO @ledjay fix the autoscroll to error
  // useEffect(() => {
  //   if (hasErrors && tableContainerRef.current) {
  //     requestAnimationFrame(() => {
  //       tableContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  //     });
  //   }
  // });

  return (
    <div
      ref={tableContainerRef}
      className={cn(
        "w-full bg-lifted-grey overflow-hidden",
        "rounded-lg border-1 border-default-grey",
        "[&_th]:uppercase [&_th_small]:block [&_th_tr]:text-mention-grey [&_th]:py-2 [&_th]:px-4 [&_th]:text-center [&_th]:text-xs",
        "[&_td]:py-2 [&_td]:px-4 [&_td]:text-center [&_td]:text-sm ",
        enableBorders &&
          "[&_tr]:border-b [&_tbody_tr:last-child]:border-b-0 [&_th]:border-default-grey [&_tr]:border-default-grey [&_td]:border-default-grey",
        hasErrors && "border-action-high-error",
        className
      )}
    >
      <table aria-labelledby={ariaLabelledBy} className="w-full">
        {title && <caption>{title}</caption>}

        <thead>
          {preHeadings && (
            <tr className="bg-default-grey-hover">
              {preHeadings?.map((preHeading, index) =>
                typeof preHeading === "string" ? (
                  <th scope="col" key={`col-${index}`}>
                    {preHeading}
                  </th>
                ) : (
                  <Fragment key={index}>{preHeading}</Fragment>
                )
              )}
            </tr>
          )}
          {headings && (
            <tr className={cn(!preHeadings && "bg-default-grey-hover")}>
              {headings?.map((heading, index) =>
                typeof heading === "string" ? (
                  <th scope="col" key={`col-${index}`}>
                    {heading}
                  </th>
                ) : (
                  <Fragment key={index}>{heading}</Fragment>
                )
              )}
            </tr>
          )}
        </thead>
        <tbody className="[&>tr>td]:py-2 [&>tr>td]:px-4 [&>tr>td]:text-center [&>tr>td]:text-sm">
          {children}
        </tbody>
      </table>
    </div>
  );
};

Table.displayName = "Table";

type Props = PropsWithChildren<{
  title?: string;
  headings: (string | ReactElement)[];
  preHeadings?: (string | ReactElement)[];
  ariaLabelledBy: string;
  className?: string;
  enableBorders?: boolean;
  hasErrors?: boolean;
}>;
