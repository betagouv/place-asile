import { useStructureContext } from "../../../context/StructureClientContext";
import {
  isStructureAutorisee,
  isStructureSubventionnee,
} from "@/app/utils/structure.util";
import { StructureAutorisee } from "./gestionBudgetaireTables/StructureAutorisee";
import { StructureAutoriseeSansCpom } from "./gestionBudgetaireTables/StructureAutoriseeSansCpom";
import { StructureSubventionneeSansCpom } from "./gestionBudgetaireTables/StructureSubventionneeSansCpom";
import { StructureSubventionnee } from "./gestionBudgetaireTables/StructureSubventionnee";
import { DetailAffectationTable } from "./DetailAffectationTable";

export const BudgetTables = () => {
  const { structure } = useStructureContext();
  const hasCpom = structure?.cpom;
  const isAutorisee = isStructureAutorisee(structure?.type);
  const isSubventionnee = isStructureSubventionnee(structure?.type);

  // const hideDetails = isSubventionnee && !!hasCpom;
  const hideDetails = false;

  return (
    <>
      <fieldset className="flex flex-col gap-6">
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
      <>
        <hr />
        <fieldset className="flex flex-col gap-6">
          <legend className="text-lg font-bold mb-8 text-title-blue-france">
            {structure?.cpom
              ? "Détail affectation réserves, provisions et fonds dédiés du CPOM"
              : "Détail affectation réserves et provisions"}
          </legend>
          <p className="mb-0 w-3/5">
            Veuillez renseigner l’historique des affectations en réserves,
            provisions et fonds dédiés du CPOM. Pour rendre une année éditable,
            il faut que le montant saisi dans la colonne “affectation réserves
            et fonds dédiés” du tableau précédent soit supérieur à 0 pour cette
            année-là.
          </p>
          <DetailAffectationTable sliceYears={isSubventionnee ? 3 : 2} />
        </fieldset>
      </>
      {hideDetails ? <>hide</> : null}
    </>
  );
};
