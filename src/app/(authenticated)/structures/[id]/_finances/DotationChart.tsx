import { ReactElement } from "react";

import BarChart from "@/app/components/common/BarChart";
import { isStructureAutorisee } from "@/app/utils/structure.util";
import { Budget } from "@/types/budget.type";

import { useStructureContext } from "../context/StructureClientContext";

export const DotationChart = (): ReactElement => {
  const { structure } = useStructureContext();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const yearsWithBudget = years
    .map((year) => {
      return {
        year,
        budget: structure.budgets?.find(
          (budget) => new Date(budget.date).getFullYear() === year
        ),
      };
    })
    .reverse();

  const getPropertySerie = (propertyName: keyof Budget): number[] => {
    return (
      yearsWithBudget.map((budget) => Number(budget.budget?.[propertyName])) ||
      []
    );
  };

  const getChartData = () => {
    const labels = yearsWithBudget.map((budget) => budget.year);
    const series = [
      getPropertySerie("dotationDemandee"),
      getPropertySerie("dotationAccordee"),
      getPropertySerie("totalProduits"),
      getPropertySerie("totalCharges"),
    ];
    return {
      labels,
      series,
    };
  };

  const options = {
    seriesBarDistance: 10,
    axisY: {
      offset: 50,
      labelInterpolationFnc: (value: number) => value.toLocaleString(),
    },
  };

  //TODO : remplacer les couleurs hardcodées par celles du DSFR
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-2">
        <BarChart data={getChartData()} options={options} />
      </div>
      <div>
        <h5 className="text-title-blue-france text-sm font-medium mb-1">
          {isStructureAutorisee(structure.type)
            ? "Fixation de la dotation (dans budget)"
            : "Fixation de la dotation (dans demande subventions)"}
        </h5>
        <div className="flex items-center">
          <div className="h-3 w-3 bg-[#FCC63A]" />
          <p className="pl-2 mb-0">Dotation demandée par l’opérateur</p>
        </div>
        <div className="flex items-center pb-5">
          <div className="h-3 w-3 bg-[#C3992A]" />
          <p className="pl-2 mb-0">Dotation totale accordée par l’État</p>
        </div>
        <h5 className="text-title-blue-france text-sm font-medium mb-1">
          {isStructureAutorisee(structure.type)
            ? "Équilibre économique (dans compte administratif)"
            : "Équilibre économique (dans compte-rendu financier)"}
        </h5>
        <div className="flex items-center">
          <div className="h-3 w-3 bg-[#FBB8F6]" />
          <p className="pl-2 mb-0">Total des produits (dont dotation État)</p>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 bg-[#B6CFFB]" />
          <p className="pl-2 mb-0">Total des charges retenues</p>
        </div>
      </div>
    </div>
  );
};
