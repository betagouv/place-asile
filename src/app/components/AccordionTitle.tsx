import { ReactElement } from "react";

export const AccordionTitle = ({ title, lastVisit }: Props): ReactElement => {
  return (
    <div className="flex justify-between w-full">
      <span>{title}</span>
      <span className="text-mention-grey italic fr-pr-1w">
        Dernier le{" "}
        <strong>{new Date(lastVisit).toLocaleDateString("fr-FR")}</strong>
      </span>
    </div>
  );
};

type Props = {
  title: string;
  lastVisit: Date;
};
