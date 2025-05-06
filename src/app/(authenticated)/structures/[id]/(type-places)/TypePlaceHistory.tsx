import { ReactElement } from "react";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { Adresse } from "@/types/adresse.type";
import { StructureTypologie } from "@/types/structure-typologie.type";
import styles from "../../../../components/common/Accordion.module.css";
import { AdresseTypologie } from "@prisma/client";

export const TypePlaceHistory = ({
  adresses,
  structureTypologies,
}: Props): ReactElement => {
  const getCurrentStructureTypologie = (
    adresseTypologie: AdresseTypologie | undefined
  ) => {
    return structureTypologies.find((structureTypologie) => {
      if (!adresseTypologie?.date) {
        return "N/A";
      }
      const adresseTypologieYear = new Date(
        adresseTypologie?.date
      ).getFullYear();
      const structureTypologieYear = new Date(
        structureTypologie?.date
      ).getFullYear();
      return adresseTypologieYear === structureTypologieYear;
    });
  };

  const getTableData = () => {
    const adresseTypologies = adresses?.flatMap(
      (adresse) => adresse.typologies
    );
    return adresseTypologies.map((adresseTypologie) => {
      const currentStructureTypologie =
        getCurrentStructureTypologie(adresseTypologie);

      return [
        adresseTypologie?.date
          ? new Date(adresseTypologie?.date).getFullYear()
          : "N/A",
        adresseTypologie?.nbPlacesTotal,
        currentStructureTypologie?.pmr ?? "N/A",
        currentStructureTypologie?.lgbt,
        currentStructureTypologie?.fvvTeh,
        adresseTypologie?.qpv,
        adresseTypologie?.logementSocial,
      ];
    });
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
