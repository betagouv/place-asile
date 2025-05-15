import { PropsWithChildren, ReactElement } from "react";

export const Year = ({ children, year }: YearProps): ReactElement => {
  return (
    <fieldset className="flex flex-col gap-4 border-default-grey border-b pb-8 mb-6">
      <h2 className="text-title-blue-france text-xl mb-0">{year}</h2>
      <div className="grid grid-cols-3 gap-10">{children}</div>
    </fieldset>
  );
};

type YearProps = PropsWithChildren & {
  year: string;
};
