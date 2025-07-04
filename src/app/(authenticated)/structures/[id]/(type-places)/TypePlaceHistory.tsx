import { ReactElement } from "react";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { Adresse } from "@/types/adresse.type";
import { StructureTypologie } from "@/types/structure-typologie.type";
import styles from "../../../../components/common/Accordion.module.css";

export const TypePlaceHistory = ({
  adresses,
  structureTypologies,
}: Props): ReactElement => {
  const getCurrentStructureTypologie = (
    adresseTypologieDate: Date | undefined
  ) => {
    return structureTypologies.find((structureTypologie) => {
      if (!adresseTypologieDate) {
        return "N/A";
      }
      const adresseTypologieYear = new Date(adresseTypologieDate).getFullYear();
      const structureTypologieYear = new Date(
        structureTypologie?.date
      ).getFullYear();
      return adresseTypologieYear === structureTypologieYear;
    });
  };

  const getTableData = () => {
    const adresseTypologies = adresses?.flatMap(
      (adresse) => adresse.adresseTypologies
    );

    const groupedByYear = adresseTypologies.reduce(
      (aggregatedTypePlaces: AggregatedTypePlaces, adresseTypologie) => {
        const year = adresseTypologie?.date
          ? new Date(adresseTypologie.date).getFullYear()
          : "N/A";

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

    return Object.entries(groupedByYear)
      .map(([year, data]) => {
        const currentStructureTypologie = getCurrentStructureTypologie(
          new Date(year !== "N/A" ? year : "")
        );

        return [
          year,
          data.nbPlacesTotal,
          currentStructureTypologie?.pmr ?? "N/A",
          currentStructureTypologie?.lgbt ?? "N/A",
          currentStructureTypologie?.fvvTeh ?? "N/A",
          data.qpv,
          data.logementSocial,
        ];
      })
      .reverse();
  };

  return (
    <Accordion label="Historique" className={styles["custom-accordion"]}>
      <Table
        bordered={true}
        className="fr-m-0"
        caption=""
        data={getTableData()}
        headers={[
          "ANNÉE",
          "TOTAL",
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
