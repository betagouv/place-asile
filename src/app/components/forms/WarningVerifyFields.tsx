import { InformationBar } from "@/app/components/ui/InformationBar";
import { Structure, StructureState } from "@/types/structure.type";

export default function WarningVerifyFields({
  structure,
}: {
  structure: Structure;
}) {
  return (
    structure.state === StructureState.A_FINALISER && (
      <InformationBar
        variant="warning"
        title="À vérifier"
        description="Veuillez vérifier les informations et/ou les documents suivants transmis par l’opérateur."
      />
    )
  );
}
