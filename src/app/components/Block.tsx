import { PropsWithChildren, ReactElement } from "react";
import styles from "./Block.module.css";

export const Block = ({ title, iconClass, children }: Props): ReactElement => {
  return (
    <div className={`bg-white fr-p-2w ${styles.container}`}>
      <div className="d-flex">
        <span className={`text-blue-france fr-mr-1w ${iconClass}`} />
        <h3 className="text-blue-france fr-h5">{title}</h3>
      </div>
      {children}
    </div>
  );
};

type Props = PropsWithChildren<{
  title: string;
  iconClass: string;
}>;
