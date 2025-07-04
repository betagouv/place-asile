import { ReactElement } from "react";
import { EmptyCell } from "@/app/components/common/EmptyCell";
import { AmountBadge } from "./AmountBadge";
import { useStructureContext } from "../context/StructureClientContext";
import { isStructureAutorisee } from "@/app/utils/structure.util";

export const GestionBudgetaireAvecCpomTable = (): ReactElement => {
  const { structure } = useStructureContext();

  const primaryHeadingsStructureAutorisee = [
    { title: "BUDGET EXÉCUTOIRE DE LA STRUCTURE", colSpan: 2 },
    { title: "COMPTE ADMINISTRATIF DE LA STRUCTURE", colSpan: 1 },
    { title: "COMPTE ADMINISTRATIF DU CPOM", colSpan: 3 },
  ];

  const primaryHeadingsStructureSubventionnee = [
    { title: "DEMANDE DE SUBVENTION DE LA STRUCTURE", colSpan: 2 },
    { title: "COMPTE-RENDU FINANCIER DE LA STRUCTURE", colSpan: 1 },
    { title: "COMPTE ADMINISTRATIF DU CPOM", colSpan: 3 },
  ];

  const primaryHeadings = isStructureAutorisee(structure.type)
    ? primaryHeadingsStructureAutorisee
    : primaryHeadingsStructureSubventionnee;

  const secondaryHeadings = [
    "ANNÉE",
    "DOTATION DEMANDÉE",
    "DOTATION ACCORDÉE",
    "RÉSULTAT NET",
    "CUMUL RÉSULTATS NETS DU CPOM",
    "REPRISE ÉTAT",
    "AFFECTATION RÉSERVES & FONDS DÉDIÉS",
  ];

  const computeResultatNet = (
    totalCharges: number | null,
    totalProduits: number | null
  ): number => {
    if (!totalCharges || !totalProduits) {
      return 0;
    }
    return totalCharges - totalProduits;
  };

  // TODO : provide aria labeled by
  return (
    <div className="w-full bg-lifted-grey border-1 border-default-grey rounded-lg">
      <table className="w-full">
        <thead>
          <col />
          <colgroup span={2}></colgroup>
          <colgroup span={1}></colgroup>
          <colgroup span={3}></colgroup>
          <tr className="bg-alt-grey">
            <td rowSpan={1}></td>
            {primaryHeadings.map((primaryHeading) => (
              <th
                key={primaryHeading.title}
                colSpan={primaryHeading.colSpan}
                scope="colgroup"
                className="text-xs py-2 px-4 text-center"
              >
                {primaryHeading.title}
              </th>
            ))}
          </tr>
          <tr className="border-t-1 border-default-grey">
            {secondaryHeadings.map((secondaryHeading) => (
              <th
                scope="col"
                key={secondaryHeading}
                className="text-xs py-2 px-4 text-center"
              >
                {secondaryHeading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {structure?.budgets?.map((budget) => (
            <tr key={budget.id} className="border-t-1 border-default-grey">
              <td className="py-2 px-4 text-center text-sm">
                {new Date(budget.date).getFullYear()}
              </td>
              {budget.dotationDemandee ? (
                <td className="py-2 px-4 text-center test-sm">
                  {budget.dotationDemandee} €
                </td>
              ) : (
                <EmptyCell />
              )}
              {budget.dotationAccordee ? (
                <td className="py-2 px-4 text-center test-sm">
                  {budget.dotationAccordee} €
                </td>
              ) : (
                <EmptyCell />
              )}
              {budget.totalCharges && budget.totalProduits ? (
                <td className="py-2 px-4 text-center test-sm">
                  <span className="pr-2">
                    {computeResultatNet(
                      budget.totalCharges,
                      budget.totalProduits
                    )}{" "}
                    €
                  </span>
                  <AmountBadge
                    amount={computeResultatNet(
                      budget.totalCharges,
                      budget.totalProduits
                    )}
                  />
                </td>
              ) : (
                <EmptyCell />
              )}
              {budget.cumulResultatsNetsCPOM ? (
                <td className="py-2 px-4 text-center test-sm">
                  <span className="pr-2">
                    {budget.cumulResultatsNetsCPOM} €
                  </span>
                  <AmountBadge amount={budget.cumulResultatsNetsCPOM} />
                </td>
              ) : (
                <EmptyCell />
              )}
              {budget.dotationAccordee ? (
                <td className="py-2 px-4 text-center test-sm">
                  {budget.repriseEtat} €
                </td>
              ) : (
                <EmptyCell />
              )}
              {budget.cumulResultatsNetsCPOM &&
              budget.repriseEtat &&
              budget.affectationReservesFondsDedies! > 0 ? (
                <td className="py-2 px-4 text-center test-sm">
                  {budget.affectationReservesFondsDedies} €
                </td>
              ) : (
                <EmptyCell />
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
