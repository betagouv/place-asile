import { cn } from "@/app/utils/classname.util";
import {
  PropsWithChildren,
  ReactElement,
  Fragment,
  useEffect,
  useRef,
} from "react";

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

  // Increment on every render to ensure we can detect new renders
  renderCountRef.current += 1;

  // This effect will run on every render when hasErrors is true
  // The empty dependency array ensures it runs on every render
  useEffect(() => {
    // If there are errors, scroll the table into view
    if (hasErrors && tableContainerRef.current) {
      // Use requestAnimationFrame to ensure this happens in the next frame
      // This helps with smoother scrolling and ensures the DOM is ready
      // Use requestAnimationFrame to ensure this happens in the next frame
      requestAnimationFrame(() => {
        // Use standard scrollIntoView - the CSS scroll-margin-top will be applied
        // if the element has the scroll-margin-header class
        tableContainerRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  });

  return (
    <div
      ref={tableContainerRef}
      className={cn(
        "w-full bg-lifted-grey overflow-hidden",
        "rounded-lg border-1 border-default-grey",
        "[&_th]:uppercase [&_th]:text-mention-grey [&_th]:py-4 [&_th]:px-5 [&_th]:text-center [&_th]:text-xs",
        "[&_td]:py-2 [&_td]:px-4 [&_td]:text-center [&_td]:text-sm",
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
                  <th
                    scope="col"
                    key={`col-${index}`}
                    className="uppercase text-mention-grey py-4 px-5 text-center text-xs"
                  >
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
                  <th
                    scope="col"
                    key={`col-${index}`}
                    className="uppercase text-mention-grey py-4 px-5 text-center text-xs"
                  >
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
