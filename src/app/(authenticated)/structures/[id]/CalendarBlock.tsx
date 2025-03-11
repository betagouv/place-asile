import { Block } from "@/app/components/common/Block";
import { DateBars } from "@/app/components/DateBars";
import { ReactElement } from "react";

export const CalendarBlock = ({
  periodeAutorisationStart,
  periodeAutorisationEnd,
  debutConvention,
  finConvention,
  cpomStart,
  cpomEnd,
}: Props): ReactElement => {
  const datePairs = [
    {
      label: "Période d’autorisation",
      startDate: periodeAutorisationStart,
      endDate: periodeAutorisationEnd,
    },
    {
      label: "Convention en cours",
      startDate: debutConvention,
      endDate: finConvention,
    },
    { label: "CPOM", startDate: cpomStart, endDate: cpomEnd },
  ];
  return (
    <Block title="Calendrier" iconClass="fr-icon-calendar-2-line">
      <DateBars datePairs={datePairs} />
    </Block>
  );
};

type Props = {
  periodeAutorisationStart: Date;
  periodeAutorisationEnd: Date;
  debutConvention: Date;
  finConvention: Date;
  cpomStart: Date;
  cpomEnd: Date;
};
