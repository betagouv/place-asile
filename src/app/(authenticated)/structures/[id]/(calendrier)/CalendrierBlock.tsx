import { Block } from "@/app/components/common/Block";
import { DateBars } from "@/app/(authenticated)/structures/[id]/(calendrier)/DateBars";
import { ReactElement } from "react";
import { useStructureContext } from "../context/StructureClientContext";

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

  // TODO : remove this when 01/01/1970 removed from DB
  const isFakeDate = (date: Date) => {
    return new Date(date).getFullYear() === 1970;
  };

  const datePairs = [];
  if (
    debutPeriodeAutorisation &&
    finPeriodeAutorisation &&
    !isFakeDate(debutPeriodeAutorisation)
  ) {
    datePairs.push({
      label: "Période d’autorisation",
      startDate: debutPeriodeAutorisation,
      endDate: finPeriodeAutorisation,
    });
  }
  if (debutConvention && finConvention && !isFakeDate(debutConvention)) {
    datePairs.push({
      label: "Convention en cours",
      startDate: debutConvention,
      endDate: finConvention,
    });
  }
  if (debutCpom && finCpom && !isFakeDate(debutCpom)) {
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
