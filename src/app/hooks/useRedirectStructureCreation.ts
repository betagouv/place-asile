"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { StructureApiType } from "@/schemas/api/structure.schema";
import { AjoutIdentificationFormValues } from "@/schemas/forms/ajout/ajoutIdentification.schema";
import { DocumentsFinanciersFlexibleFormValues } from "@/schemas/forms/base/documentFinancier.schema";

import { useLocalStorage } from "./useLocalStorage";

export function useRedirectStructureCreation() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const dnaCode = params.dnaCode as string;

  const { currentValue: localStorageIdentificationValues } = useLocalStorage<
    Partial<AjoutIdentificationFormValues>
  >(`ajout-structure-${dnaCode}-identification`, {});

  const { currentValue: localStorageDocumentsValues } = useLocalStorage<
    Partial<DocumentsFinanciersFlexibleFormValues>
  >(`ajout-structure-${dnaCode}-documents`, {});

  // Redirect if we did not go through the selection page
  useEffect(() => {
    if (
      !localStorageDocumentsValues?.structureMillesimes ||
      !localStorageIdentificationValues?.type
    ) {
      router.replace(`/ajout-structure`);
    }
  }, [
    localStorageDocumentsValues,
    localStorageIdentificationValues,
    router,
    dnaCode,
  ]);

  // Redirect if the structure already exists
  useEffect(() => {
    async function checkExistence() {
      if (!dnaCode) {
        return;
      }

      try {
        const result = await fetch(`/api/structures/dna/${dnaCode}`, {
          cache: "no-store",
        });

        if (!result.ok) {
          console.error(`API error: ${result.status}`, await result.text());
          return;
        }

        const structure: StructureApiType | null = await result.json();

        if (structure?.forms && structure?.forms?.length > 0) {
          router.replace(`/ajout-structure/existe-deja?dnaCode=${dnaCode}`);
        }
      } catch (error) {
        console.error("Error checking for existing structure:", error);
      }
    }

    checkExistence();
  }, [dnaCode, pathname, router]);
}
