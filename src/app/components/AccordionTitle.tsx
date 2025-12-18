import { ReactElement } from "react";

import { formatDate } from "@/app/utils/date.util";

export const AccordionTitle = ({ title, lastVisit }: Props): ReactElement => {
  return (
    <div className="flex justify-between w-full">
      <span>{title}</span>
      <span className="text-mention-grey italic fr-pr-1w">
        Dernier le{" "}
        {lastVisit ? (
          <strong>{formatDate(lastVisit)}</strong>
        ) : (
          <strong>-</strong>
        )}
      </span>
    </div>
  );
};

type Props = {
  title: string;
  lastVisit?: string;
};
