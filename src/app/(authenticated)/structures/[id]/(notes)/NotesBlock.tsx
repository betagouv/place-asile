import { Block } from "@/app/components/common/Block";
import { ReactElement } from "react";

export const NotesBlock = ({ notes }: Props): ReactElement => {
  return (
    <Block iconClass="fr-icon-message-2-line" title="Notes">
      {notes || "Aucune note renseignée"}
    </Block>
  );
};

type Props = {
  notes: string;
};
