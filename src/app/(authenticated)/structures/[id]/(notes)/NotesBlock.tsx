import { ReactElement } from "react";

import { Block } from "@/app/components/common/Block";

import { useStructureContext } from "../context/StructureClientContext";

export const NotesBlock = (): ReactElement => {
  const { structure } = useStructureContext();

  return (
    <Block iconClass="fr-icon-message-2-line" title="Notes">
      <span className="whitespace-pre-wrap">
        {structure.notes || "Aucune note renseignée"}
      </span>
    </Block>
  );
};
