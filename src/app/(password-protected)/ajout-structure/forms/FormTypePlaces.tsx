"use client";
import FormWrapper from "@/app/components/forms/FormWrapper";
import React, { useMemo } from "react";
import { TypePlacesSchema } from "../validation/validation";
import { useParams } from "next/navigation";
import Link from "next/link";
import InputWithValidation from "@/app/components/forms/InputWithValidation";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { Table } from "@/app/components/common/Table";

export default function FormTypePlaces() {
  const params = useParams();
  const previousRoute = `/ajout-structure/${params.dnaCode}/02-addresses`;

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
      nextRoute={previousRoute}
      mode="onBlur"
      defaultValues={mergedDefaultValues}
      className="gap-2"
    >
      {({ control }) => {
        return (
          <>
            <Link
              href={previousRoute}
              className="fr-link fr-icon border-b w-fit pb-px hover:pb-0 hover:border-b-2"
            >
              <i className="fr-icon-arrow-left-s-line before:w-4"></i>
              Étape précédente
            </Link>

            <p>
              Veuillez renseigner l’historique du nombre de places pour chaque
              typologie de ces trois dernières années.
            </p>
            <Table
              headings={["Année", "Autorisées", "PMR", "LGBT", "FVV/TEH"]}
              ariaLabelledBy=""
              className="[&_th]:px-0 text-center w-fit "
            >
              {years.map((year) => (
                <tr
                  key={year}
                  className="w-full [&_input]:max-w-[4rem] border-t border-default-grey "
                >
                  <td className="align-middle py-4">{year}</td>
                  <td className="!py-4">
                    <InputWithValidation
                      name={`${year}.autorisees`}
                      control={control}
                      type="number"
                      label=""
                      className="mb-0 mx-auto items-center"
                      variant="simple"
                    />
                  </td>
                  <td className="!py-1">
                    <InputWithValidation
                      name={`${year}.pmr`}
                      control={control}
                      type="number"
                      label=""
                      className="mb-0 mx-auto items-center"
                      variant="simple"
                    />
                  </td>
                  <td className="!py-1">
                    <InputWithValidation
                      name={`${year}.lgbt`}
                      control={control}
                      type="number"
                      label=""
                      className="mb-0 mx-auto items-center"
                      variant="simple"
                    />
                  </td>
                  <td className="!py-1">
                    <InputWithValidation
                      name={`${year}.fvvTeh`}
                      control={control}
                      type="number"
                      label=""
                      className="mb-0 mx-auto items-center  "
                      variant="simple"
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
