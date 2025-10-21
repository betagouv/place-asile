import dayjs from "dayjs";
import { ReactElement } from "react";

import { EmptyCell } from "@/app/components/common/EmptyCell";
import { NumberDisplay } from "@/app/components/common/NumberDisplay";
import { isNullOrUndefined } from "@/app/utils/common.util";

import { useStructureContext } from "../context/StructureClientContext";
import { AmountBadge } from "./AmountBadge";

export const GestionBudgetaireSubventionneeSansCpomTable = (): ReactElement => {
  const { structure } = useStructureContext();

  const budgets = structure?.budgets?.filter((budget) => {
    return (
      !isNullOrUndefined(budget.dotationDemandee) &&
      !isNullOrUndefined(budget.dotationAccordee) &&
      !isNullOrUndefined(budget.totalProduits) &&
      !isNullOrUndefined(budget.totalCharges) &&
      !isNullOrUndefined(budget.repriseEtat) &&
      !isNullOrUndefined(budget.excedentRecupere) &&
      !isNullOrUndefined(budget.excedentDeduit) &&
      !isNullOrUndefined(budget.fondsDedies) &&
      !isNullOrUndefined(budget.commentaire)
    );
  });

  const primaryHeadings = [
    { title: "BUDGET EXÉCUTOIRE DE LA STRUCTURE", colSpan: 2 },
    { title: "COMPTE ADMINISTRATIF DE LA STRUCTURE", colSpan: 7 },
  ];

  const secondaryHeadings = [
    "ANNÉE",
    "DOTATION DEMANDÉE",
    "DOTATION ACCORDÉE",
    "RÉSULTAT NET",
    "DÉFICIT COMPENSÉ PAR L'ÉTAT",
    "EXCÉDENT RÉCUPÉRÉ TITRE DE RECETTE",
    "À RÉEMPLOYER DANS DOTATION À VENIR",
    "RESTANT FONDS DÉDIÉS",
    "CUMUL FONDS DÉDIÉS",
    "COMMENTAIRE",
  ];

  const computeResultatNet = (
    totalCharges: number | null,
    totalProduits: number | null
  ): number => {
    if (!totalCharges || !totalProduits) {
      return 0;
    }
    return totalProduits - totalCharges;
  };

  const computeCumulFondsDedies = (date: string) => {
    const dateObject = new Date(date);
    let currentYearFondsDedies = 0;
    let previousYearFondsDedies = 0;
    budgets?.forEach((budget) => {
      if (dayjs(budget.date).isSame(dayjs(dateObject))) {
        currentYearFondsDedies = budget.fondsDedies;
      }
      if (dayjs(budget.date).isSame(dayjs(dateObject).subtract(1, "year"))) {
        previousYearFondsDedies = budget.fondsDedies;
      }
    });
    return currentYearFondsDedies + previousYearFondsDedies;
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
          {budgets?.map((budget) => (
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
                {!isNullOrUndefined(budget.excedentRecupere) ? (
                  <NumberDisplay value={budget.repriseEtat} type="currency" />
                ) : (
                  <EmptyCell />
                )}
              </td>
              <td className="py-2 px-4 text-center test-sm">
                {!isNullOrUndefined(budget.excedentRecupere) ? (
                  <NumberDisplay
                    value={budget.excedentRecupere}
                    type="currency"
                  />
                ) : (
                  <EmptyCell />
                )}
              </td>
              <td className="py-2 px-4 text-center test-sm">
                {!isNullOrUndefined(budget.excedentDeduit) ? (
                  <NumberDisplay
                    value={budget.excedentDeduit}
                    type="currency"
                  />
                ) : (
                  <EmptyCell />
                )}
              </td>
              <td className="py-2 px-4 text-center test-sm">
                {!isNullOrUndefined(budget.fondsDedies) ? (
                  <NumberDisplay value={budget.fondsDedies} type="currency" />
                ) : (
                  <EmptyCell />
                )}
              </td>
              <td className="py-2 px-4 text-center test-sm">
                {!isNullOrUndefined(budget.fondsDedies) ? (
                  <NumberDisplay
                    value={computeCumulFondsDedies(budget.date)}
                    type="currency"
                  />
                ) : (
                  <EmptyCell />
                )}
              </td>
              <td className="py-2 px-4 text-center test-sm">
                {budget.commentaire ?? <EmptyCell />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
