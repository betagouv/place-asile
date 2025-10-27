import { useRouter } from "next/navigation";
import { ReactElement } from "react";

import { Block } from "@/app/components/common/Block";

import { useStructureContext } from "../../_context/StructureClientContext";

export const NotesBlock = (): ReactElement => {
  const { structure } = useStructureContext();

  const router = useRouter();

  return (
    <Block
      iconClass="fr-icon-message-2-line"
      title="Notes"
      onEdit={() => {
        router.push(`/structures/${structure.id}/modification/07-notes`);
      }}
    >
      <span className="whitespace-pre-wrap">
        {structure.notes || "Aucune note renseignée"}
      </span>
    </Block>
  );
};
