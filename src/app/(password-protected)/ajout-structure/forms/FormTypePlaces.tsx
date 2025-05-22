"use client";
import FormWrapper from "@/app/components/forms/FormWrapper";
import React, { useMemo } from "react";
import { TypePlacesSchema } from "../validation/validation";
import { useParams } from "next/navigation";
import Link from "next/link";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { Table } from "@/app/components/common/Table";
import Notice from "@codegouvfr/react-dsfr/Notice";
import { getYearDate } from "@/app/utils/date.util";

export default function FormTypePlaces() {
  const params = useParams();
  const previousRoute = `/ajout-structure/${params.dnaCode}/02-adresses`;
  const nextRoute = `/ajout-structure/${params.dnaCode}/04-documents`;

  const years = useMemo(() => [2023, 2024, 2025] as const, []);

  const { currentValue: localStorageValues } = useLocalStorage(
    `ajout-structure-${params.dnaCode}-type-places`,
    {}
  );

  const mergedDefaultValues = useMemo(() => {
    return localStorageValues || {};
  }, [localStorageValues]);

  return (
    <FormWrapper
      schema={TypePlacesSchema}
      localStorageKey={`ajout-structure-${params.dnaCode}-type-places`}
      nextRoute={nextRoute}
      mode="onBlur"
      defaultValues={mergedDefaultValues}
      className="gap-2"
      submitButtonText="Étape suivante"
    >
      {({ control, register }) => {
        return (
          <>
            <Link
              href={previousRoute}
              className="fr-link fr-icon border-b w-fit pb-px hover:pb-0 hover:border-b-2 mb-8"
            >
              <i className="fr-icon-arrow-left-s-line before:w-4"></i>
              Étape précédente
            </Link>

            <p>
              Veuillez renseigner l’historique du nombre de places pour chaque
              typologie au 1er janvier de ces trois dernières années.
            </p>

            <Notice
              severity="info"
              title=""
              className="rounded [&_p]:flex  [&_p]:items-center mb-8"
              description="PMR : Personnes à Mobilité Réduite – LGBT : Lesbiennes, Gays, Bisexuels et Transgenres – FVV : Femmes Victimes de Violences–TEH : Traîte des Êtres Humains"
            />

            <Table
              headings={["Année", "Autorisées", "PMR", "LGBT", "FVV/TEH"]}
              ariaLabelledBy=""
              className="[&_th]:px-0 text-center w-fit "
            >
              {years.map((year, index) => (
                <tr
                  key={year}
                  className="w-full [&_input]:max-w-[4rem] border-t border-default-grey "
                >
                  <td className="align-middle py-4">{year}</td>
                  <td className="!py-4">
                    <InputWithValidation
                      name={`typologies.${index}.autorisees`}
                      control={control}
                      type="number"
                      label=""
                      className="mb-0 mx-auto items-center"
                      variant="simple"
                    />
                  </td>
                  <td className="!py-1">
                    <InputWithValidation
                      name={`typologies.${index}.pmr`}
                      control={control}
                      type="number"
                      label=""
                      className="mb-0 mx-auto items-center"
                      variant="simple"
                    />
                  </td>
                  <td className="!py-1">
                    <InputWithValidation
                      name={`typologies.${index}.lgbt`}
                      control={control}
                      type="number"
                      label=""
                      className="mb-0 mx-auto items-center"
                      variant="simple"
                    />
                  </td>
                  <td className="!py-1">
                    <InputWithValidation
                      name={`typologies.${index}.fvvTeh`}
                      control={control}
                      type="number"
                      label=""
                      className="mb-0 mx-auto items-center  "
                      variant="simple"
                    />
                    <input
                      // value={new Date(year, 0, 1, 13).toISOString()} TODO: gérer cette date
                      aria-hidden="true"
                      defaultValue={getYearDate(String(year))}
                      type="hidden"
                      {...register(`typologies.${index}.date`)}
                    />
                  </td>
                </tr>
              ))}
            </Table>
          </>
        );
      }}
    </FormWrapper>
  );
}
