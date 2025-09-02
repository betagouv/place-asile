import Accordion from "@codegouvfr/react-dsfr/Accordion";
import Table from "@codegouvfr/react-dsfr/Table";
import { ReactElement } from "react";

import styles from "../../../../components/common/Accordion.module.css";

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
        className="m-0 [&>table]:w-[unset] [&>table>tbody>tr>td]:text-center text-mention-grey [&>table>thead]:text-mention-grey"
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
