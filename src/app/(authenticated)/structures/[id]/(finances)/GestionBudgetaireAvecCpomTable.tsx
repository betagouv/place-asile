import { ReactElement } from "react";
import { useStructureContext } from "../context/StructureClientContext";
import { EmptyCell } from "@/app/components/common/EmptyCell";
import { AmountBadge } from "./AmountBadge";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import { Budget } from "@/types/budget.type";

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

  const isBudgetEmpty = (budget: Budget): boolean => {
    return (
      !!budget.dotationAccordee &&
      !!budget.dotationAccordee &&
      !!budget.cumulResultatsNetsCPOM &&
      !!budget.repriseEtat &&
      !!budget.affectationReservesFondsDedies
    );
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
          {structure?.budgets?.filter(isBudgetEmpty).map((budget) => (
            <tr key={budget.id} className="border-t-1 border-default-grey">
              <td className="py-2 px-4 text-center text-sm">
                {new Date(budget.date).getFullYear()}
              </td>
              <td className="py-2 px-4 text-center test-sm">
                {budget.dotationDemandee ? (
                  <>{budget.dotationDemandee}&nbsp;€</>
                ) : (
                  <EmptyCell />
                )}
              </td>
              <td className="py-2 px-4 text-center test-sm">
                {budget.dotationAccordee ? (
                  <>{budget.dotationAccordee}&nbsp;€</>
                ) : (
                  <EmptyCell />
                )}
              </td>
              <td className="py-2 px-4 text-center test-sm">
                {budget.totalCharges && budget.totalProduits ? (
                  <>
                    <span className="pr-2">
                      {computeResultatNet(
                        budget.totalCharges,
                        budget.totalProduits
                      )}
                      &nbsp;€
                    </span>
                    <AmountBadge
                      amount={computeResultatNet(
                        budget.totalCharges,
                        budget.totalProduits
                      )}
                    />
                  </>
                ) : (
                  <EmptyCell />
                )}
              </td>
              <td className="py-2 px-4 text-center test-sm">
                {budget.cumulResultatsNetsCPOM ? (
                  <>
                    <span className="pr-2">
                      {budget.cumulResultatsNetsCPOM}&nbsp;€
                    </span>
                    <AmountBadge amount={budget.cumulResultatsNetsCPOM} />
                  </>
                ) : (
                  <EmptyCell />
                )}
              </td>
              <td className="py-2 px-4 text-center test-sm">
                {budget.repriseEtat ? (
                  <>{budget.repriseEtat}&nbsp;€</>
                ) : (
                  <EmptyCell />
                )}
              </td>
              <td className="py-2 px-4 text-center test-sm">
                {budget.cumulResultatsNetsCPOM &&
                budget.repriseEtat &&
                budget.affectationReservesFondsDedies! > 0 ? (
                  <>{budget.affectationReservesFondsDedies}&nbsp;€</>
                ) : (
                  <EmptyCell />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
