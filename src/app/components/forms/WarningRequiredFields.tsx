import { InformationBar } from "@/app/components/ui/InformationBar";
import { Structure, StructureState } from "@/types/structure.type";

export default function WarningRequiredFields({
  structure,
}: {
  structure: Structure;
}) {
  return (
    structure.state === StructureState.A_FINALISER && (
      <InformationBar
        variant="info"
        title="À compléter"
        description="Veuillez remplir les champs obligatoires ci-dessous. Si une donnée vous est inconnue, contactez-nous."
      />
    )
  );
}
