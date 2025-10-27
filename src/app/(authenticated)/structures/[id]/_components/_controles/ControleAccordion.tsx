import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { ReactElement } from "react";

import { AccordionTitle } from "@/app/components/AccordionTitle";
import styles from "@/app/components/common/Accordion.module.css";

export const ControleAccordion = ({
  title,
  lastVisit,
  children,
}: Props): ReactElement => {
  return (
    <Accordion
      label={<AccordionTitle title={title} lastVisit={lastVisit} />}
      className={styles["custom-accordion"]}
    >
      {children}
    </Accordion>
  );
};

type Props = {
  title: string;
  lastVisit?: string;
  children: ReactElement;
};
