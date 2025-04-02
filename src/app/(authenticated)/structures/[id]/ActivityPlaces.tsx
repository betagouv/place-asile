"use client";

import { ReactElement } from "react";
import PieChart from "@codegouvfr/react-dsfr/Chart/PieChart";

export const ActivityPlaces = (): ReactElement => {
  return (
    <div className="align-center fr-pt-3w">
      <PieChart x={[]} y={[1, 2]} />
      <span className="fr-icon-arrow-right-s-line text-blue-france" />
      <PieChart x={[]} y={[1, 2]} />
      <span className="fr-icon-arrow-right-s-line text-blue-france" />
      <PieChart x={[]} y={[1, 2]} />
    </div>
  );
};
