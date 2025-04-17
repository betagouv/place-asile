import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { ReactElement } from "react";
import styles from "../../../../components/common/Accordion.module.css";
import Table from "@codegouvfr/react-dsfr/Table";

export const ActivitesMotifsIndisponibilite = ({
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
        className="fr-m-0"
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
