import { ReactElement } from "react";
import { EmptyCell } from "@/app/components/common/EmptyCell";
import { AmountBadge } from "./AmountBadge";
import { useStructureContext } from "../context/StructureClientContext";
import dayjs from "dayjs";

export const GestionBudgetaireSubventionneeSansCpomTable = (): ReactElement => {
  const { structure } = useStructureContext();

  const primaryHeadings = [
    { title: "BUDGET EXÉCUTOIRE DE LA STRUCTURE", colSpan: 2 },
    { title: "COMPTE ADMINISTRATIF DE LA STRUCTURE", colSpan: 6 },
  ];

  const secondaryHeadings = [
    "ANNÉE",
    "DOTATION DEMANDÉE",
    "DOTATION ACCORDÉE",
    "RÉSULTAT NET",
    "DÉFICIT COMPENSÉ PAR L'ÉTAT",
    "EXCÉDENT RÉCUPÉRÉ TITRE DE RECETTE",
    "EXCÉDENT DÉDUIT DOTATION À VENIR",
    "RESTANT FONDS DÉDIÉS",
    "CUMUL FONDS DÉDIÉS",
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

  const computeCumulFondsDedies = (date: Date) => {
    // TODO : use budgets first fonds dediés
    let cumulFondsDedies = 0;
    structure.budgets?.forEach((budget) => {
      if (dayjs(budget.date).isBefore(dayjs(date))) {
        cumulFondsDedies += budget.fondsDedies;
      }
    });
    return cumulFondsDedies;
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
              {/* TODO : remplacer par DÉFICIT COMPENSÉ PAR L'ÉTAT */}
              <td className="py-2 px-4 text-center test-sm">
                <EmptyCell />
              </td>
              {/* TODO : remplacer par EXCÉDENT RÉCUPÉRÉ TITRE DE RECETTE */}
              <td className="py-2 px-4 text-center test-sm">
                <EmptyCell />
              </td>
              {/* TODO : remplacer par EXCÉDENT DÉDUIT DOTATION À VENIR */}
              <td className="py-2 px-4 text-center test-sm">
                <EmptyCell />
              </td>
              {budget.fondsDedies ? (
                <td className="py-2 px-4 text-center test-sm">
                  {budget.fondsDedies} €
                </td>
              ) : (
                <EmptyCell />
              )}
              {budget.fondsDedies ? (
                <td className="py-2 px-4 text-center test-sm">
                  {computeCumulFondsDedies(budget.date)} €
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
