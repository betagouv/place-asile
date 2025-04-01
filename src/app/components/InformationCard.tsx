import { ReactElement } from "react";
import styles from "./InformationCard.module.css";

export const InformationCard = ({
  primaryInformation,
  secondaryInformation,
}: Props): ReactElement => {
  return (
    <div className={`fr-px-3w fr-py-1w ${styles.card}`}>
      <div className="fr-h4 fr-mb-0">{primaryInformation}</div>
      <div className="text-center">{secondaryInformation}</div>
    </div>
  );
};

type Props = {
  primaryInformation: string | number;
  secondaryInformation: string;
};
