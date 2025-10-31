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

  const { updateLocalStorageValue } = useLocalStorage(
    `ajout-structure-${structureOfii?.dnaCode}-identification`,
    {}
  );

  const handleValidation = () => {
    updateLocalStorageValue({
      dnaCode: structureOfii?.dnaCode,
      operateur: structureOfii?.operateur,
      type: structureOfii?.type,
    });
    router.push(`/ajout-structure/${structureOfii?.dnaCode}/01-identification`);
  };
  return (
    <Button type="button" onClick={handleValidation} disabled={!structureOfii}>
      J’ai trouvé ma structure{" "}
      <span className="fr-icon-arrow-right-line fr-icon--md" />
    </Button>
  );
};
