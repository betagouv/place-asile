import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { ReactElement } from "react";

import { ActiviteApiType } from "@/schemas/api/activite.schema";

export const ActivitesTypes = ({
  typeActivite,
  setTypeActivite,
}: Props): ReactElement => {
  const tags = [
    {
      label: "Présences indues BPI",
      onClick: () => setTypeActivite("presencesInduesBPI"),
      value: "presencesInduesBPI",
    },
    {
      label: "Présences indues déboutées",
      onClick: () => setTypeActivite("presencesInduesDeboutees"),
      value: "presencesInduesDeboutees",
    },
    {
      label: "Présences indues totales",
      onClick: () => setTypeActivite("presencesIndues"),
      value: "presencesIndues",
    },
    {
      label: "Vacantes",
      onClick: () => setTypeActivite("placesVacantes"),
      value: "placesVacantes",
    },
    {
      label: "Indisponibles",
      onClick: () => setTypeActivite("placesIndisponibles"),
      value: "placesIndisponibles",
    },
    {
      label: "Total",
      onClick: () => setTypeActivite("nbPlaces"),
      value: "nbPlaces",
    },
  ];

  return (
    <>
      {tags.map((tag, index) => (
        <div key={`tag-${index}`} className="pr-2">
          <Tag
            nativeButtonProps={{
              onClick: tag.onClick,
            }}
            pressed={tag.value === typeActivite}
          >
            {tag.label}
          </Tag>
        </div>
      ))}
    </>
  );
};

type Props = {
  typeActivite: keyof ActiviteApiType;
  setTypeActivite: (typeActivite: keyof ActiviteApiType) => void;
};
