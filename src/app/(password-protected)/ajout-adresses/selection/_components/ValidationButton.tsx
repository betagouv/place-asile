import Button from "@codegouvfr/react-dsfr/Button";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import { useFormContext } from "react-hook-form";

export const ValidationButton = (): ReactElement => {
  const router = useRouter();
  const parentFormContext = useFormContext();
  const { watch } = parentFormContext;

  const structure = watch("structure");

  return (
    <div className="flex justify-center">
      <Button
        type="button"
        onClick={() =>
          router.push(`/ajout-adresses/${structure.dnaCode}/01-adresses`)
        }
        disabled={!structure?.dnaCode}
        className="flex gap-2"
      >
        J’ai trouvé ma structure{" "}
        <span className="fr-icon-arrow-right-line fr-icon--md" />
      </Button>
    </div>
  );
};
