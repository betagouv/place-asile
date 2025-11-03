"use client";

import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { AjoutAdressesFormValues } from "@/schemas/forms/ajout/ajoutAdresses.schema";

export const StructureName = ({ dnaCode }: Props) => {
  const { currentValue } = useLocalStorage(
    `ajout-structure-${dnaCode}-adresses`,
    {} as Partial<AjoutAdressesFormValues>
  );

  return currentValue?.nom ? <strong>{currentValue.nom} - </strong> : "";
};

type Props = { dnaCode: string | string[] };
