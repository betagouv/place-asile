import { Control, FieldValues, useController } from "react-hook-form";

import { cn } from "@/app/utils/classname.util";
import { StructureOfiiType } from "@/types/structureOfii.type";

export const StructureOfiiList = ({ structuresOfii, control }: Props) => {
  const { field } = useController({
    name: "structureOfii",
    control,
  });

  if (!structuresOfii) {
    return null;
  }
  if (structuresOfii.length === 0) {
    return <div>Aucune structure trouvée</div>;
  }

  return (
    <div>
      <h3 className="text-base font-bold mb-4 text-title-blue-france">
        Sélectionnez votre structure
      </h3>
      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
        {structuresOfii.map((structureOfii) => (
          <div key={structureOfii.dnaCode}>
            <input
              type="radio"
              id={structureOfii.dnaCode}
              name="structureOfii"
              value={structureOfii.dnaCode}
              checked={field.value?.dnaCode === structureOfii.dnaCode}
              onChange={() =>
                field.onChange({
                  dnaCode: structureOfii.dnaCode,
                  nom: structureOfii.nom,
                  type: structureOfii.type,
                  operateur: structureOfii.operateur,
                  departement: structureOfii.departement,
                })
              }
              onBlur={field.onBlur}
              ref={field.ref}
              className="sr-only"
            />
            <label
              className={cn(
                "p-4 rounded-sm border-2 flex gap-4 relative",
                field.value?.dnaCode === structureOfii.dnaCode
                  ? "border-action-high-blue-france"
                  : "border-default-grey"
              )}
              htmlFor={structureOfii.dnaCode}
            >
              <span className="fr-icon-community-line fr-icon--md text-title-blue-france" />
              <div>
                <strong className="uppercase font-bold text-title-blue-france">
                  {structureOfii.nom}
                </strong>
                <div className="text-sm ">
                  {structureOfii.dnaCode} - {structureOfii.type},{" "}
                  {structureOfii.operateur}, {structureOfii.departement}
                </div>
              </div>
              {field.value?.dnaCode === structureOfii.dnaCode && (
                <span className="absolute right-6 top-1/2 -translate-y-1/2 fr-icon-check-line fr-icon--md text-title-blue-france" />
              )}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

type Props = {
  structuresOfii: StructureOfiiType[] | undefined;
  control: Control<FieldValues>;
};
