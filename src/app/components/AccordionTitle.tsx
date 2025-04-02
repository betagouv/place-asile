import { ReactElement } from "react";

export const AccordionTitle = ({ title, lastVisit }: Props): ReactElement => {
  return (
    <div className="space-between w-full">
      <span>{title}</span>
      <span className="text-grey italic fr-pr-1w">
        Dernier le <strong>{new Date(lastVisit).toLocaleDateString()}</strong>
      </span>
    </div>
  );
};

type Props = {
  title: string;
  lastVisit: Date;
};
