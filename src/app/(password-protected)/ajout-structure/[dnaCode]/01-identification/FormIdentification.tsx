"use client";
// TODO @ledjay : split this file for code clarity
import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";

import FormWrapper from "@/app/components/forms/FormWrapper";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import autoAnimate from "@formkit/auto-animate";
import Notice from "@codegouvfr/react-dsfr/Notice";
import { PLACE_ASILE_CONTACT_EMAIL } from "@/constants";
import { StructureType } from "@/types/structure.type";
import DescriptionFields from "@/app/components/forms/structures/identification/fieldsets/DescriptionFields";
import ContactFields from "@/app/components/forms/structures/identification/fieldsets/ContactFields";
import CalendrierFields from "@/app/components/forms/structures/identification/fieldsets/CalendrierFields";
import {
  IdentificationFormValues,
  IdentificationSchema,
} from "./validation/identificationSchema";

export default function FormIdentification() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("mode") === "edit";

  const resetRoute = `/ajout-structure/${params.dnaCode}/01-identification`;
  const nextRoute = isEditMode
    ? `/ajout-structure/${params.dnaCode}/05-verification`
    : `/ajout-structure/${params.dnaCode}/02-adresses`;
  const filialesContainerRef = useRef(null);

  useEffect(() => {
    if (filialesContainerRef.current) {
      autoAnimate(filialesContainerRef.current);
    }
  }, [filialesContainerRef]);

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

  const { currentValue: localStorageValues } = useLocalStorage<
    Partial<IdentificationFormValues>
  >(`ajout-structure-${params.dnaCode}-identification`, {});

  const mergedDefaultValues = useMemo(() => {
    return {
      ...defaultValues,
      ...localStorageValues,
    };
  }, [defaultValues, localStorageValues]);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (localStorageValues && !isInitialized) {
      setIsInitialized(true);
    }
  }, [localStorageValues, isInitialized]);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  // TODO : Refacto ce composant pour isoler la logique du localStorage et éviter les problèmes de réhydratation
  if (!isClient) {
    return null;
  }
  return (
    <FormWrapper
      schema={IdentificationSchema}
      localStorageKey={`ajout-structure-${params.dnaCode}-identification`}
      nextRoute={nextRoute}
      resetRoute={resetRoute}
      mode="onBlur"
      defaultValues={mergedDefaultValues}
      submitButtonText={
        isEditMode ? "Modifier et revenir à la vérification" : "Étape suivante"
      }
    >
      <Notice
        severity="warning"
        title=""
        className="rounded [&_p]:flex  [&_p]:items-center"
        description={
          <span className="text-default-grey">
            Si votre structure regroupe plusieurs codes DNA mais est une seule
            entité juridique et/ou financière, veuillez ne pas remplir ce
            formulaire et nous contacter directement par email via{" "}
            {
              <a
                href={`mailto:${PLACE_ASILE_CONTACT_EMAIL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                placedasile@beta.gouv.fr
              </a>
            }
            .
          </span>
        }
      />
      <DescriptionFields />

      <hr />

      <h2 className="text-xl font-bold mb-0 text-title-blue-france">
        Contacts
      </h2>

      <Notice
        severity="info"
        title=""
        className="rounded [&_p]:flex [&_p]:items-center"
        description="Veuillez renseigner en contact principal la personne responsable de la structure et en contact secondaire la personne en charge du suivi opérationnel et/ou de la gestion budgétaire et financière."
      />

      <ContactFields />

      <hr />
      <h2 className="text-xl font-bold mb-0 text-title-blue-france">
        Calendrier
      </h2>
      <CalendrierFields />
    </FormWrapper>
  );
}
