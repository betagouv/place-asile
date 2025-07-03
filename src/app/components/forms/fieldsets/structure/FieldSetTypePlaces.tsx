import { cn } from "@/app/utils/classname.util";
import { getYearDate } from "@/app/utils/date.util";
import Notice from "@codegouvfr/react-dsfr/Notice";
import { Table } from "@/app/components/common/Table";
import { useFormContext } from "react-hook-form";
import React, { useMemo, useEffect, useRef } from "react";
import InputWithValidation from "../../InputWithValidation";

export const FieldSetTypePlaces = () => {
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const { control, register, formState } = useFormContext();

  const hasErrors = Object.values(formState.errors).length > 0;

  useEffect(() => {
    if (formState.errors.typologies) {
      fieldsetRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [formState]);

  const years = useMemo(() => [2025, 2024, 2023] as const, []);

  return (
    <fieldset className="flex flex-col" ref={fieldsetRef}>
      <legend className="text-lg font-bold mb-8 text-title-blue-france">
        Détails et historique
      </legend>
      <p>
        Veuillez renseigner l’historique du nombre de places pour chaque
        typologie au 1er janvier de ces trois dernières années.
      </p>
      <Notice
        severity="info"
        title=""
        className="rounded [&_p]:flex  [&_p]:items-center mb-8"
        description="PMR : Personnes à Mobilité Réduite – LGBT : Lesbiennes, Gays, Bisexuels et Transgenres (ici places définies comme spécialisées) – FVV : Femmes Victimes de Violences, TEH : Traîte des Êtres Humains (ici places définies comme labellisées)"
      />

      <Table
        headings={["Année", "Autorisées", "PMR", "LGBT", "FVV/TEH"]}
        ariaLabelledBy=""
        className={cn(
          "[&_th]:px-0 text-center w-fit",
          hasErrors && "border-action-high-error"
        )}
      >
        {years.map((year, index) => (
          <tr
            key={year}
            className="w-full [&_input]:max-w-[4rem] border-t border-default-grey "
          >
            <td className="align-middle py-4">{year}</td>
            <td className="!py-4">
              <InputWithValidation
                name={`typologies.${index}.nbPlaces`}
                id={`typologies.${index}.nbPlaces`}
                control={control}
                type="number"
                min={0}
                label=""
                className="mb-0 mx-auto items-center [&_p]:hidden"
                variant="simple"
              />
            </td>
            <td className="!py-1">
              <InputWithValidation
                name={`typologies.${index}.pmr`}
                id={`typologies.${index}.pmr`}
                control={control}
                type="number"
                min={0}
                label=""
                className="mb-0 mx-auto items-center [&_p]:hidden"
                variant="simple"
              />
            </td>
            <td className="!py-1">
              <InputWithValidation
                name={`typologies.${index}.lgbt`}
                id={`typologies.${index}.lgbt`}
                control={control}
                type="number"
                min={0}
                label=""
                className="mb-0 mx-auto items-center [&_p]:hidden"
                variant="simple"
              />
            </td>

            <td className="!py-1">
              <InputWithValidation
                name={`typologies.${index}.fvvTeh`}
                id={`typologies.${index}.fvvTeh`}
                control={control}
                type="number"
                min={0}
                label=""
                className="mb-0 mx-auto items-center [&_p]:hidden"
                variant="simple"
              />
              <input
                aria-hidden="true"
                defaultValue={getYearDate(String(year))}
                type="hidden"
                {...register(`typologies.${index}.date`)}
              />
            </td>
          </tr>
        ))}
      </Table>
      {hasErrors && (
        <p className="text-label-red-marianne">
          Toutes les cases doivent être remplies
        </p>
      )}
    </fieldset>
  );
};
