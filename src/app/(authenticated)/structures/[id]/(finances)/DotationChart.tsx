import BarChart from "@/app/components/common/BarChart";
import { ReactElement } from "react";
import { useStructureContext } from "../context/StructureContext";
import { Budget } from "@/types/budget.type";

export const DotationChart = (): ReactElement => {
  const { structure } = useStructureContext();

  const getPropertySerie = (
    propertyName: keyof Budget,
    minYear: number
  ): number[] => {
    return (
      structure.budgets?.reverse().map((budget) => {
        if (new Date(budget.date).getFullYear() >= minYear) {
          return Number(budget[propertyName]);
        }
        return 0;
      }) || []
    );
  };

  const getChartData = () => {
    // TODO : rendre cette liste dynamique en fonction de l'année en cours
    const labels = ["2021", "2022", "2023", "2024", "2025"];
    const minYear = Number(labels[0]);
    const series = [
      getPropertySerie("dotationDemandee", minYear),
      getPropertySerie("dotationAccordee", minYear),
      getPropertySerie("totalProduits", minYear),
      getPropertySerie("totalCharges", minYear),
    ];
    return {
      labels,
      series,
    };
  };

  const options = {
    seriesBarDistance: 10,
  };

  //TODO : remplacer les couleurs hardcodées par celles du DSFR
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-2">
        <BarChart data={getChartData()} options={options} />
      </div>
      <div>
        <h5 className="text-title-blue-france text-sm font-medium mb-1">
          Fixation de la dotation (dans budget)
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
          Équilibre économique (dans compte administratif)
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
