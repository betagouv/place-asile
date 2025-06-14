import { Block } from "@/app/components/common/Block";
import { DateBars } from "@/app/(authenticated)/structures/[id]/(calendrier)/DateBars";
import { ReactElement } from "react";
import { useStructureContext } from "../context/StructureContext";

export const CalendrierBlock = (): ReactElement => {
  const { structure } = useStructureContext();
  const {
    debutPeriodeAutorisation,
    finPeriodeAutorisation,
    debutConvention,
    finConvention,
    debutCpom,
    finCpom,
  } = structure;

  const datePairs = [];
  if (debutPeriodeAutorisation && finPeriodeAutorisation) {
    datePairs.push({
      label: "Période d’autorisation",
      startDate: debutPeriodeAutorisation,
      endDate: finPeriodeAutorisation,
    });
  }
  if (debutConvention && finConvention) {
    datePairs.push({
      label: "Convention en cours",
      startDate: debutConvention,
      endDate: finConvention,
    });
  }
  if (debutCpom && finCpom) {
    datePairs.push({
      label: "CPOM",
      startDate: debutCpom,
      endDate: finCpom,
    });
  }
  return (
    <Block title="Calendrier" iconClass="fr-icon-calendar-2-line">
      <DateBars datePairs={datePairs} />
    </Block>
  );
};
