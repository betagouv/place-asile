import { PropsWithChildren, ReactElement } from "react";

import { cn } from "@/app/utils/classname.util";

export const Year = ({
  children,
  year,
  startYear,
}: YearProps): ReactElement => {
  return (
    <fieldset
      className={cn(
        "flex flex-col gap-4 border-default-grey border-b pb-8 mb-6",
        startYear && Number(year) < startYear && "hidden"
      )}
    >
      <h2 className="text-title-blue-france text-xl mb-0">{year}</h2>
      <div className="grid grid-cols-3 gap-10 items-stretch">{children}</div>
    </fieldset>
  );
};

type YearProps = PropsWithChildren & {
  year: number | string;
  startYear?: number;
};
