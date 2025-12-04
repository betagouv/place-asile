"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { StructureApiType } from "@/schemas/api/structure.schema";

export function useRedirectIfStructureExists() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const dnaCode = params.dnaCode as string;

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
