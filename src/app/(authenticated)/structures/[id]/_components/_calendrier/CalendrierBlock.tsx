import { useRouter } from "next/navigation";
import { ReactElement } from "react";

import { DateBars } from "@/app/(authenticated)/structures/[id]/_components/_calendrier/DateBars";
import { Block } from "@/app/components/common/Block";

import { useStructureContext } from "../../_context/StructureClientContext";

export const CalendrierBlock = (): ReactElement => {
  const { structure } = useStructureContext();

  const router = useRouter();

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
    <Block
      title="Calendrier"
      iconClass="fr-icon-calendar-2-line"
      onEdit={() => {
        router.push(`/structures/${structure.id}/modification/02-calendrier`);
      }}
    >
      <DateBars datePairs={datePairs} />
    </Block>
  );
};
