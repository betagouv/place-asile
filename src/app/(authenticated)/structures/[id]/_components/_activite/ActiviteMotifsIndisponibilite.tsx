import Accordion from "@codegouvfr/react-dsfr/Accordion";
import Table from "@codegouvfr/react-dsfr/Table";
import { ReactElement } from "react";

import styles from "@/app/components/common/Accordion.module.css";

export const ActiviteMotifsIndisponibilite = ({
  desinsectisation,
  remiseEnEtat,
  sousOccupation,
  travaux,
}: Props): ReactElement => {
  const getTableData = () => {
    return [
      ["Désinsectisation", desinsectisation],
      ["Remise en état de l'unité", remiseEnEtat],
      ["Sous-occupation", sousOccupation],
      ["Travaux", travaux],
    ];
  };
  return (
    <Accordion
      label="Motifs d'indisponibilité"
      className={styles["custom-accordion"]}
    >
      <Table
        bordered={true}
        className="full-width-table"
        caption=""
        data={getTableData()}
        headers={["MOTIF", "PLACES CONCERNÉES"]}
      />
    </Accordion>
  );
};

type Props = {
  desinsectisation: number;
  remiseEnEtat: number;
  sousOccupation: number;
  travaux: number;
};
