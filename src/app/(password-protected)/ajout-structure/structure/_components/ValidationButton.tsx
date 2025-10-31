import Button from "@codegouvfr/react-dsfr/Button";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import { useFormContext } from "react-hook-form";

import { useLocalStorage } from "@/app/hooks/useLocalStorage";

export const ValidationButton = (): ReactElement => {
  const router = useRouter();

  const parentFormContext = useFormContext();
  const { watch } = parentFormContext;

  const structureOfii = watch("structureOfii");

  const { updateLocalStorageValue: updateIdentification } = useLocalStorage(
    `ajout-structure-${structureOfii?.dnaCode}-identification`,
    {}
  );

  const { updateLocalStorageValue: updateAdresses } = useLocalStorage(
    `ajout-structure-${structureOfii?.dnaCode}-adresses`,
    {}
  );

  const handleValidation = () => {
    updateIdentification({
      dnaCode: structureOfii?.dnaCode,
      operateur: structureOfii?.operateur,
      type: structureOfii?.type,
    });
    updateAdresses({
      nom: structureOfii?.nom,
    });
    router.push(`/ajout-structure/${structureOfii?.dnaCode}/01-identification`);
  };
  return (
    <div className="flex justify-center">
      <Button
        type="button"
        onClick={handleValidation}
        disabled={!structureOfii}
        className="flex gap-2"
      >
        J’ai trouvé ma structure{" "}
        <span className="fr-icon-arrow-right-line fr-icon--md" />
      </Button>
    </div>
  );
};
