import { ReactElement } from "react";

import { EmptyCell } from "@/app/components/common/EmptyCell";
import { NumberDisplay } from "@/app/components/common/NumberDisplay";
import { isNullOrUndefined } from "@/app/utils/common.util";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import { Budget } from "@/types/budget.type";

import { useStructureContext } from "../../_context/StructureClientContext";
import { AmountBadge } from "./AmountBadge";

export const GestionBudgetaireAvecCpomTable = (): ReactElement => {
  const { structure } = useStructureContext();

  const primaryHeadingsStructureAutorisee = [
    { title: "BUDGET DE LA STRUCTURE", colSpan: 2 },
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
      isNullOrUndefined(budget.dotationAccordee) &&
      isNullOrUndefined(budget.dotationAccordee) &&
      isNullOrUndefined(budget.cumulResultatsNetsCPOM) &&
      isNullOrUndefined(budget.repriseEtat) &&
      isNullOrUndefined(budget.affectationReservesFondsDedies)
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
          {structure?.budgets
            ?.filter((budget) => !isBudgetEmpty(budget))
            .map((budget) => (
              <tr key={budget.id} className="border-t-1 border-default-grey">
                <td className="py-2 px-4 text-center text-sm">
                  {new Date(budget.date).getFullYear()}
                </td>
                <td className="py-2 px-4 text-center test-sm">
                  {!isNullOrUndefined(budget.dotationDemandee) ? (
                    <NumberDisplay
                      value={budget.dotationDemandee}
                      type="currency"
                    />
                  ) : (
                    <EmptyCell />
                  )}
                </td>
                <td className="py-2 px-4 text-center test-sm">
                  {!isNullOrUndefined(budget.dotationAccordee) ? (
                    <NumberDisplay
                      value={budget.dotationAccordee}
                      type="currency"
                    />
                  ) : (
                    <EmptyCell />
                  )}
                </td>
                <td className="py-2 px-4 text-center test-sm">
                  {!isNullOrUndefined(budget.totalCharges) &&
                  !isNullOrUndefined(budget.totalProduits) ? (
                    <>
                      <NumberDisplay
                        className="pr-2"
                        value={computeResultatNet(
                          budget.totalCharges,
                          budget.totalProduits
                        )}
                        type="currency"
                      />
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
                  {!isNullOrUndefined(budget.cumulResultatsNetsCPOM) ? (
                    <>
                      <NumberDisplay
                        className="pr-2"
                        value={budget.cumulResultatsNetsCPOM}
                        type="currency"
                      />
                      <AmountBadge amount={budget.cumulResultatsNetsCPOM} />
                    </>
                  ) : (
                    <EmptyCell />
                  )}
                </td>
                <td className="py-2 px-4 text-center test-sm">
                  {!isNullOrUndefined(budget.repriseEtat) ? (
                    <NumberDisplay value={budget.repriseEtat} type="currency" />
                  ) : (
                    <EmptyCell />
                  )}
                </td>
                <td className="py-2 px-4 text-center test-sm">
                  {!isNullOrUndefined(budget.affectationReservesFondsDedies) &&
                  budget.affectationReservesFondsDedies! > 0 ? (
                    <NumberDisplay
                      value={budget.affectationReservesFondsDedies}
                      type="currency"
                    />
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
