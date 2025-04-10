"use client";

import { ReactElement, useState } from "react";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { Activite } from "@/types/activite.type";
import { ActivitesDurationChooser } from "./ActivitesDurationChooser";
import { MultiLineChart } from "@/app/components/common/MultiLineChart";
import { getLastMonths } from "@/app/utils/date.util";

const tags = [
  {
    label: "Présences indues BPI",
    onClick: () => console.log("TEST"),
  },
  {
    label: "Présences indues déboutées",
    onClick: () => console.log("TEST"),
  },
  {
    label: "Présences indues totales",
    onClick: () => console.log("TEST"),
  },
  {
    label: "Vacantes",
    onClick: () => console.log("TEST"),
  },
  {
    label: "Indisponibles",
    onClick: () => console.log("TEST"),
  },
  {
    label: "Total",
    onClick: () => console.log("TEST"),
  },
];

export const ActivitesHistorique = ({
  activites,
  debutConvention,
  finConvention,
}: Props): ReactElement => {
  const [selectedMonths, setSelectedMonths] = useState<string[]>(
    getLastMonths(6)
  );

  return (
    <div>
      <h4 className="fr-text--lg text-title-blue-france">Historique</h4>
      <div className="flex pb-5">
        {tags.map((tag, index) => (
          <div key={`tag-${index}`} className="fr-pr-1w">
            <Tag
              nativeButtonProps={{
                onClick: tag.onClick,
              }}
            >
              {tag.label}
            </Tag>
          </div>
        ))}
      </div>
      <div className="pb-5">
        <ActivitesDurationChooser
          setSelectedMonths={setSelectedMonths}
          debutConvention={debutConvention}
          finConvention={finConvention}
        />
      </div>
      <MultiLineChart
        width={800}
        x={[selectedMonths]}
        y={[
          [
            activites[5]?.placesPIdeboutees,
            activites[4]?.placesPIdeboutees,
            activites[3]?.placesPIdeboutees,
            activites[2]?.placesPIdeboutees,
            activites[1]?.placesPIdeboutees,
            activites[0]?.placesPIdeboutees,
          ],
          [4, 4, 4, 4, 4, 4],
          [3, 3, 3, 3, 3, 3],
        ]}
      />
    </div>
  );
};

type Props = {
  activites: Activite[];
  debutConvention: Date | null;
  finConvention: Date | null;
};
