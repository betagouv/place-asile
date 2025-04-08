import { Block } from "@/app/components/common/Block";
import { DateBars } from "@/app/components/DateBars";
import { ReactElement } from "react";

export const CalendrierBlock = ({
  debutPeriodeAutorisation,
  finPeriodeAutorisation,
  debutConvention,
  finConvention,
  debutCpom,
  finCpom,
}: Props): ReactElement => {
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
    datePairs.push({ label: "CPOM", startDate: debutCpom, endDate: finCpom });
  }
  return (
    <Block title="Calendrier" iconClass="fr-icon-calendar-2-line">
      <DateBars datePairs={datePairs} />
    </Block>
  );
};

type Props = {
  debutPeriodeAutorisation: Date | null;
  finPeriodeAutorisation: Date | null;
  debutConvention: Date | null;
  finConvention: Date | null;
  debutCpom: Date | null;
  finCpom: Date | null;
};
