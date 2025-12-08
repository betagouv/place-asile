import Button from "@codegouvfr/react-dsfr/Button";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import { useFormContext } from "react-hook-form";

import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { StructureMillesimeApiType } from "@/schemas/api/structure-millesime.schema";

export const ValidationButtonWithHook = (): ReactElement => {
  const router = useRouter();

  const parentFormContext = useFormContext();
  const { watch } = parentFormContext;

  const structure = watch("structure");

  const {
    updateLocalStorageValue: updateIdentification,
    currentValue: localIdentificationValue,
  } = useLocalStorage(
    `ajout-structure-${structure?.dnaCode}-identification`,
    {}
  );

  const {
    updateLocalStorageValue: updateAdresses,
    currentValue: localAdressesValue,
  } = useLocalStorage(`ajout-structure-${structure?.dnaCode}-adresses`, {});

  const {
    updateLocalStorageValue: updateDocuments,
    currentValue: localDocumentsValue,
  } = useLocalStorage(`ajout-structure-${structure?.dnaCode}-documents`, {});

  const handleValidation = () => {
    updateIdentification({
      ...localIdentificationValue,
      dnaCode: structure?.dnaCode,
      operateur: structure?.operateur,
      type: structure?.type,
    });
    updateAdresses({
      ...localAdressesValue,
      nom: structure?.nom,
    });

    const years = [2021, 2022, 2023, 2024, 2025];
    const filteredStructureMillesimes = structure?.structureMillesimes?.filter(
      (millesime: StructureMillesimeApiType) =>
        years.includes(parseInt(millesime.date.substring(0, 4)))
    );

    const structureMillesimes = years.map((year: number) => ({
      date: year,
      cpom:
        filteredStructureMillesimes?.find(
          (millesime: StructureMillesimeApiType) =>
            millesime.date.substring(0, 4) === year.toString()
        )?.cpom ?? false,
      operateurComment:
        filteredStructureMillesimes?.find(
          (millesime: StructureMillesimeApiType) =>
            millesime.date.substring(0, 4) === year.toString()
        )?.operateurComment ?? undefined,
    }));

    updateDocuments({
      ...localDocumentsValue,
      structureMillesimes: structureMillesimes,
    });
    router.push(`/ajout-structure/${structure?.dnaCode}/01-identification`);
  };

  return (
    <div className="flex justify-center">
      <Button
        type="button"
        onClick={handleValidation}
        disabled={!structure}
        className="flex gap-2"
      >
        J’ai trouvé ma structure{" "}
        <span className="fr-icon-arrow-right-line fr-icon--md" />
      </Button>
    </div>
  );
};
