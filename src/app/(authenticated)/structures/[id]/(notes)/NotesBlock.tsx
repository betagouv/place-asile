import { Block } from "@/app/components/common/Block";
import { ReactElement } from "react";
import { useStructureContext } from "../context/StructureClientContext";

export const NotesBlock = (): ReactElement => {
  const { structure } = useStructureContext();

  return (
    <Block iconClass="fr-icon-message-2-line" title="Notes">
      {structure.notes || "Aucune note renseignée"}
    </Block>
  );
};
