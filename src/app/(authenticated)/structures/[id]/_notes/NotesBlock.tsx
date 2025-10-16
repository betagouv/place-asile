import { useRouter } from "next/navigation";
import { ReactElement } from "react";

import { Block } from "@/app/components/common/Block";
import { StructureState } from "@/types/structure.type";

import { useStructureContext } from "../context/StructureClientContext";

export const NotesBlock = (): ReactElement => {
  const { structure } = useStructureContext();

  const router = useRouter();

  return (
    <Block
      iconClass="fr-icon-message-2-line"
      title="Notes"
      onEdit={
        structure.state === StructureState.FINALISE
          ? () => {
              router.push(`/structures/${structure.id}/modification/07-notes`);
            }
          : undefined
      }
    >
      <span className="whitespace-pre-wrap">
        {structure.notes || "Aucune note renseignée"}
      </span>
    </Block>
  );
};
