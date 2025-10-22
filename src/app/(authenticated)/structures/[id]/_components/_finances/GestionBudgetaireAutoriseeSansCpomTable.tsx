import { ReactElement } from "react";

import { EmptyCell } from "@/app/components/common/EmptyCell";
import { NumberDisplay } from "@/app/components/common/NumberDisplay";
import { isNullOrUndefined } from "@/app/utils/common.util";

import { useStructureContext } from "../../_context/StructureClientContext";
import { AmountBadge } from "./AmountBadge";

export const GestionBudgetaireAutoriseeSansCpomTable = (): ReactElement => {
  const { structure } = useStructureContext();

  const primaryHeadings = [
    { title: "BUDGET DE LA STRUCTURE", colSpan: 2 },
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
            <th rowSpan={1} className="!border-r-1 border-default-grey"></th>
            {primaryHeadings.map((primaryHeading, index) => (
              <th
                key={primaryHeading.title}
                colSpan={primaryHeading.colSpan}
                scope="colgroup"
                className={`text-xs py-2 px-4 text-center ${index === 0 ? "!border-r-3 border-default-grey" : ""}`}
              >
                {primaryHeading.title}
              </th>
            ))}
          </tr>
          <tr className="border-t-1 border-default-grey">
            {secondaryHeadings.map((secondaryHeading, index) => (
              <th
                scope="col"
                key={secondaryHeading}
                className={`text-xs py-2 px-4 text-center ${index === 2 ? "!border-r-3" : ""} ${index === 0 ? "!border-r-1" : ""} border-default-grey`}
              >
                {secondaryHeading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {structure?.budgets?.map((budget) => (
            <tr key={budget.id} className="border-t-1 border-default-grey">
              <td className="py-2 px-4 text-center text-sm !border-r-1 border-default-grey">
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
              <td className="py-2 px-4 text-center test-sm !border-r-3 border-default-grey">
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
                  <NumberDisplay
                    className="pr-2"
                    value={computeResultatNetProposeParOperateur(
                      budget.totalProduits,
                      budget.totalCharges
                    )}
                    type="currency"
                  />
                ) : (
                  <EmptyCell />
                )}
              </td>
              <td className="py-2 px-4 text-center test-sm">
                {!isNullOrUndefined(budget.totalProduits) &&
                !isNullOrUndefined(budget.totalCharges) ? (
                  <>
                    <NumberDisplay
                      className="pr-2"
                      value={computeResultatNetRetenuParAutoriteTarifaire(
                        budget.totalProduits,
                        budget.totalCharges
                      )}
                      type="currency"
                    />
                    <AmountBadge
                      amount={computeResultatNetRetenuParAutoriteTarifaire(
                        budget.totalProduits,
                        budget.totalCharges
                      )}
                    />
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
