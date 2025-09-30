import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";

import { useStructureContext } from "../../../context/StructureClientContext";
import { DetailAffectationTable } from "./DetailAffectationTable";
import { StructureAutorisee } from "./gestion-budgetaire-tables/StructureAutorisee";
import { StructureAutoriseeSansCpom } from "./gestion-budgetaire-tables/StructureAutoriseeSansCpom";
import { StructureSubventionnee } from "./gestion-budgetaire-tables/StructureSubventionnee";
import { StructureSubventionneeSansCpom } from "./gestion-budgetaire-tables/StructureSubventionneeSansCpom";

export const BudgetTables = () => {
  const { structure } = useStructureContext();
  const hasCpom = structure?.cpom;
  const isAutorisee = isStructureAutorisee(structure?.type);
  const isSubventionnee = isStructureSubventionnee(structure?.type);

  return (
    <>
      <fieldset className="flex flex-col gap-6 min-w-0 w-full">
        <legend className="text-lg font-bold mb-8 text-title-blue-france">
          Gestion budgétaire
        </legend>
        <p className="mb-0">
          Veuillez renseigner l’historique de ces données budgétaires.
        </p>
        {isAutorisee &&
          (hasCpom ? <StructureAutorisee /> : <StructureAutoriseeSansCpom />)}
        {isSubventionnee &&
          (hasCpom ? (
            <StructureSubventionnee />
          ) : (
            <StructureSubventionneeSansCpom />
          ))}
      </fieldset>
      {(isAutorisee || (isSubventionnee && hasCpom)) && (
        <>
          <hr />
          <fieldset className="flex flex-col gap-6 min-w-0 w-full">
            <legend className="text-lg font-bold mb-8 text-title-blue-france">
              {structure?.cpom
                ? "Détail affectation réserves, provisions et fonds dédiés du CPOM"
                : "Détail affectation réserves et provisions"}
            </legend>
            <p className="mb-0 w-4/5">
              {structure?.cpom
                ? "Veuillez renseigner l’historique des affectations en réserves, provisions et fonds dédiés du CPOM. Pour rendre une année éditable, il faut que le montant saisi dans la colonne “affectation réserves et fonds dédiés” du tableau précédent soit supérieur à 0 pour cette année-là."
                : "Veuillez renseigner l’historique des affectations en réserves et provisions de la structure. Pour rendre une année éditable, il faut que le montant saisi dans la colonne “affectation réserves et provisions” du tableau précédent soit supérieur à 0 pour cette année-là."}
            </p>
            <DetailAffectationTable sliceYears={isSubventionnee ? 3 : 2} />
          </fieldset>
        </>
      )}
    </>
  );
};
