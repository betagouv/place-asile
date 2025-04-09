import { ReactElement } from "react";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { Activite } from "@/types/activite.type";

export const ActivitesTypes = ({
  typeActivite,
  setTypeActivite,
}: Props): ReactElement => {
  const tags = [
    {
      label: "Présences indues BPI",
      onClick: () => setTypeActivite("placesPIBPI"),
      value: "placesPIBPI",
    },
    {
      label: "Présences indues déboutées",
      onClick: () => setTypeActivite("placesPIdeboutees"),
      value: "placesPIdeboutees",
    },
    {
      label: "Présences indues totales",
      onClick: () => setTypeActivite("placesIndues"),
      value: "placesIndues",
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
        <div key={`tag-${index}`} className="fr-pr-1w">
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
  typeActivite: keyof Activite;
  setTypeActivite: (typeActivite: keyof Activite) => void;
};
