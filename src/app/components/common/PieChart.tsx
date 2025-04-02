import dynamic from "next/dynamic";
import { ChartColor } from "@codegouvfr/react-dsfr/Chart/chartWrapper";
import { PropsWithChildren, ReactElement } from "react";
import styles from "./PieChart.module.css";

const DsfrPieChart = dynamic(
  () => import("@codegouvfr/react-dsfr/Chart/PieChart"),
  {
    ssr: false,
  }
);

export const PieChart = ({
  x,
  y,
  color,
  fill,
  children,
  width = 200,
}: Props): ReactElement => {
  return (
    <div style={{ width: `${width}px` }} className={styles.container}>
      <DsfrPieChart x={x} y={y} color={color} fill={fill} />
      {children}
    </div>
  );
};

type Props = PropsWithChildren<{
  x: number[];
  y: number[];
  color?: ChartColor[];
  fill?: boolean;
  width?: number;
}>;
