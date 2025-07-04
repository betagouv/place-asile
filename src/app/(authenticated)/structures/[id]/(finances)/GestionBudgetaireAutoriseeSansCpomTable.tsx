import { ReactElement } from "react";
import { EmptyCell } from "@/app/components/common/EmptyCell";
import { AmountBadge } from "./AmountBadge";
import { useStructureContext } from "../context/StructureClientContext";

export const GestionBudgetaireAutoriseeSansCpomTable = (): ReactElement => {
  const { structure } = useStructureContext();

  const primaryHeadings = [
    { title: "BUDGET EXÉCUTOIRE DE LA STRUCTURE", colSpan: 2 },
    { title: "COMPTE ADMINISTRATIF DE LA STRUCTURE", colSpan: 4 },
  ];

  const secondaryHeadings = [
    "ANNÉE",
    "DOTATION DEMANDÉE",
    "DOTATION ACCORDÉE",
    "RÉSULTAT NET PROPOSÉ PAR L'OPÉRATEUR",
    "RÉSULTAT NET RETENU PAR AUTORITÉ TARIFAIRE",
    "REPRISE ÉTAT",
    "AFFECTATION RÉSERVES ET PROVISIONS",
  ];

  const computeResultatNetProposeParOperateur = (
    totalProduitsProposesParOperateur: number | null,
    totalChargesProposeesParOperateur: number | null
  ): number => {
    if (
      !totalProduitsProposesParOperateur ||
      !totalChargesProposeesParOperateur
    ) {
      return 0;
    }
    return (
      totalProduitsProposesParOperateur - totalChargesProposeesParOperateur
    );
  };

  const computeResultatNetRetenuParAutoriteTarifaire = (
    totalProduits: number | null,
    totalChargesRetenues: number | null
  ): number => {
    if (!totalProduits || !totalChargesRetenues) {
      return 0;
    }
    return totalProduits - totalChargesRetenues;
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
                    {computeResultatNetProposeParOperateur(
                      budget.totalProduits,
                      budget.totalCharges
                    )}{" "}
                    €
                  </span>
                </td>
              ) : (
                <EmptyCell />
              )}
              {/* TODO : vérifier la différence entre résultat net proposé et retenu */}
              {budget.totalProduits && budget.totalCharges ? (
                <td className="py-2 px-4 text-center test-sm">
                  <span className="pr-2">
                    {computeResultatNetRetenuParAutoriteTarifaire(
                      budget.totalProduits,
                      budget.totalCharges
                    )}{" "}
                    €
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
