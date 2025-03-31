import { ReactElement } from "react";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { Adresse } from "@/types/adresse.type";
import { Pmr } from "@/types/pmr.type";

export const TypePlaceHistory = ({ adresses, pmrs }: Props): ReactElement => {
  const getTableData = () => {
    const typologies = adresses?.flatMap((adresse) => adresse.typologies);
    return typologies.map((typologie) => {
      const currentPmr = pmrs.find((pmr) => {
        if (!typologie?.date) {
          return "N/A";
        }
        const typologieYear = new Date(typologie?.date).getFullYear();
        const pmrYear = new Date(pmr?.date).getFullYear();
        return typologieYear === pmrYear;
      });

      return [
        typologie?.date ? new Date(typologie?.date).getFullYear() : "N/A",
        typologie?.nbPlacesTotal,
        currentPmr?.nbPlaces ?? "N/A",
        typologie?.lgbt,
        typologie?.fvvTeh,
        typologie?.qpv,
        typologie?.logementSocial,
      ];
    });
  };

  return (
    <Accordion label="Historique">
      <Table
        bordered={true}
        colorVariant="blue-ecume"
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
  pmrs: Pmr[];
};
