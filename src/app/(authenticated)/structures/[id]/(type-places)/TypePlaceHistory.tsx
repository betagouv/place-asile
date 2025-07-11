import { ReactElement } from "react";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { Adresse } from "@/types/adresse.type";
import { StructureTypologie } from "@/types/structure-typologie.type";
import styles from "../../../../components/common/Accordion.module.css";
import { AdresseTypologie } from "@/types/adresse-typologie.type";

export const TypePlaceHistory = ({
  adresses,
  structureTypologies,
}: Props): ReactElement => {
  const getCurrentStructureTypologie = (year: number | undefined) => {
    if (year === undefined) {
      return undefined;
    }
    return structureTypologies.find((structureTypologie) => {
      const structureTypologieYear = new Date(
        structureTypologie?.date
      ).getFullYear();
      return structureTypologieYear === year;
    });
  };

  const getYearsFromTypologie = (
    typologies: (AdresseTypologie | undefined)[] | StructureTypologie[]
  ) => {
    return typologies.map((typologie) =>
      typologie?.date ? new Date(typologie.date).getFullYear() : undefined
    );
  };

  const getTableData = () => {
    const adresseTypologies =
      adresses?.flatMap((adresse) => adresse.adresseTypologies) ?? [];

    const allYears = Array.from(
      new Set([
        ...getYearsFromTypologie(adresseTypologies),
        ...getYearsFromTypologie(structureTypologies),
      ])
    ).sort((firstElement, secondElement) =>
      firstElement === undefined
        ? 1
        : secondElement === undefined
        ? -1
        : secondElement - firstElement
    );

    const groupedByYear = adresseTypologies.reduce(
      (aggregatedTypePlaces: AggregatedTypePlaces, adresseTypologie) => {
        const year = adresseTypologie?.date
          ? new Date(adresseTypologie.date).getFullYear()
          : undefined;

        if (!aggregatedTypePlaces[year as number]) {
          aggregatedTypePlaces[year as number] = {
            nbPlacesTotal: 0,
            qpv: 0,
            logementSocial: 0,
          };
        }

        aggregatedTypePlaces[year as number].nbPlacesTotal +=
          adresseTypologie?.nbPlacesTotal || 0;
        aggregatedTypePlaces[year as number].qpv += adresseTypologie?.qpv || 0;
        aggregatedTypePlaces[year as number].logementSocial +=
          adresseTypologie?.logementSocial || 0;
        return aggregatedTypePlaces;
      },
      {}
    );

    return allYears.map((year) => {
      const data = groupedByYear[year as number] || {
        nbPlacesTotal: 0,
        qpv: 0,
        logementSocial: 0,
      };
      const currentStructureTypologie = getCurrentStructureTypologie(
        year !== undefined ? year : undefined
      );

      return [
        year,
        currentStructureTypologie?.nbPlaces ?? "N/A",
        currentStructureTypologie?.pmr ?? "N/A",
        currentStructureTypologie?.lgbt ?? "N/A",
        currentStructureTypologie?.fvvTeh ?? "N/A",
        data.qpv ?? "N/A",
        data.logementSocial ?? "N/A",
      ];
    });
  };

  return (
    <Accordion label="Historique" className={styles["custom-accordion"]}>
      <Table
        bordered={true}
        className="m-0"
        caption=""
        data={getTableData()}
        headers={[
          "ANNÉE",
          "AUTORISÉES",
          "PMR",
          "LGBT",
          "FVV-TEH",
          "QPV",
          "LOG. SOCIAL",
        ]}
      />
    </Accordion>
  );
};

type Props = {
  adresses: Adresse[];
  structureTypologies: StructureTypologie[];
};

type AggregatedTypePlaces = Record<
  number,
  {
    nbPlacesTotal: number;
    qpv: number;
    logementSocial: number;
  }
>;
