import dynamic from "next/dynamic";
import { PropsWithChildren, ReactElement } from "react";
import styles from "./MultiLineChart.module.css";
import { ChartColor } from "@codegouvfr/react-dsfr/Chart/chartWrapper";

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
  color,
}: Props): ReactElement => {
  return (
    <div style={{ width: `${width}px` }} className={styles.container}>
      <DsfrMultiLineChart x={x} y={y} color={color} />
      {children}
    </div>
  );
};

type Props = PropsWithChildren<{
  x: (number | string)[][];
  y: number[][];
  width?: number;
  color?: ChartColor[];
}>;
