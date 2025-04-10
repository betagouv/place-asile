import dynamic from "next/dynamic";
import { PropsWithChildren, ReactElement } from "react";
import styles from "./PieChart.module.css";

const DsfrMultiLineChart = dynamic(
  () => import("@codegouvfr/react-dsfr/Chart/MultiLineChart"),
  {
    ssr: false,
  }
);

export const MultiLineChart = ({
  x,
  y,
  children,
  width = 500,
}: Props): ReactElement => {
  return (
    <div style={{ width: `${width}px` }} className={styles.container}>
      <DsfrMultiLineChart x={x} y={y} />
      {children}
    </div>
  );
};

type Props = PropsWithChildren<{
  x: (number | string)[][];
  y: number[][];
  width?: number;
}>;
