import BarChart from "@/app/components/common/BarChart";
import { ReactElement } from "react";
import { useStructureContext } from "../context/StructureClientContext";
import { Budget } from "@/types/budget.type";
import { isStructureAutorisee } from "@/app/utils/structure.util";

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
