"use client";
import React, { useMemo } from "react";
import FormWrapper from "@/app/components/forms/FormWrapper";
import { IdentificationFinalisationSchema } from "./validation/identificationFinalisationSchema";
import { useParams, usePathname } from "next/navigation";
import { useStructureContext } from "../../../context/StructureContext";
import Link from "next/link";
import DescriptionFields from "@/app/components/forms/structures/identification/fieldsets/DescriptionFields";
import { StructureType } from "@prisma/client";
import CalendrierFields from "@/app/components/forms/structures/identification/fieldsets/CalendrierFields";
import ContactFields from "@/app/components/forms/structures/identification/fieldsets/ContactFields";

export const FormIdentificationFinalisation = () => {
  const structurecontext = useStructureContext();
  const { structure } = structurecontext;

  console.log("structure", structure);
  const params = useParams();
  const currentRoute = usePathname();
  const previousRoute = `/structures/${params.id}`;
  const nextRoute = `/structures/${params.id}/finalisation/02-adresses`;
  const resetRoute = currentRoute;

  const defaultType = useMemo(() => {
    if (!params.dnaCode) {
      return undefined;
    }
    const dnaCode = params.dnaCode as string;

    if (dnaCode.startsWith("C")) {
      return StructureType.CADA;
    }
    if (dnaCode.startsWith("H")) {
      return StructureType.HUDA;
    }
    if (dnaCode.startsWith("K")) {
      return StructureType.CAES;
    }
    if (dnaCode.startsWith("R")) {
      return StructureType.CPH;
    }
    return undefined;
  }, [params.dnaCode]);

  const defaultValues = useMemo(() => {
    return {
      cpom: false,
      type: defaultType,
    };
  }, [defaultType]);

  // Define default values by merging with local storage values
  const mergedDefaultValues = {
    ...defaultValues,
    ...structure,
    // Add any additional default values here if needed
  };

  console.log("mergedDefaultValues", mergedDefaultValues);

  return (
    <FormWrapper
      schema={IdentificationFinalisationSchema}
      localStorageKey={`structure-${params.id}-identification`}
      nextRoute={nextRoute}
      resetRoute={resetRoute}
      mode="onBlur"
      defaultValues={mergedDefaultValues}
      submitButtonText={"Étape suivante"}
    >
      <Link
        href={previousRoute}
        className="fr-link fr-icon border-b w-fit pb-px hover:pb-0 hover:border-b-2 mb-8"
      >
        <i className="fr-icon-arrow-left-s-line before:w-4"></i>
        Étape précédente
      </Link>

      <DescriptionFields />
      <ContactFields />
      <CalendrierFields />
      <pre>{JSON.stringify(structure, null, 2)}</pre>
    </FormWrapper>
  );
};
