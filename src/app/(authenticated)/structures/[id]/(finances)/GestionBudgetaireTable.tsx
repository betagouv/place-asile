import { ReactElement } from "react";
import { useStructureContext } from "../context/StructureContext";
import { EmptyCell } from "@/app/components/common/EmptyCell";
import { AmountBadge } from "./AmountBadge";

export const GestionBudgetaireTable = (): ReactElement => {
  const { structure } = useStructureContext();

  const primaryHeadings = [
    { title: "BUDGET EXÉCUTOIRE DE LA STRUCTURE", colSpan: 2 },
    { title: "COMPTE ADMINISTRATIF DE LA STRUCTURE", colSpan: 1 },
    { title: "COMPTE ADMINISTRATIF DU CPOM", colSpan: 3 },
  ];

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

  const computeAffectationReserves = (
    cumulResultatsNetsCPOM: number,
    repriseEtat: number
  ) => {
    return cumulResultatsNetsCPOM + repriseEtat;
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
              <td className="py-2 px-4 text-center test-sm">
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
              computeAffectationReserves(
                budget.cumulResultatsNetsCPOM,
                budget.repriseEtat
              ) > 0 ? (
                <td className="py-2 px-4 text-center test-sm">
                  {computeAffectationReserves(
                    budget.cumulResultatsNetsCPOM,
                    budget.repriseEtat
                  )}{" "}
                  €
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
