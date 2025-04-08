import { Block } from "@/app/components/common/Block";
import { InformationCard } from "@/app/components/InformationCard";
import { Controle } from "@/types/controle.type";
import { Evaluation } from "@/types/evaluation.type";
import { EvenementIndesirableGrave } from "@/types/evenementIndesirableGrave.type";
import { ReactElement } from "react";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { EvaluationTable } from "./EvaluationTable";
import { ControleTable } from "./ControleTable";
import { EIGTable } from "./EIGTable";
import dayjs from "dayjs";
import styles from "../../../components/common/Accordion.module.css";
import Link from "next/link";
import { AccordionTitle } from "@/app/components/AccordionTitle";

export const ControlesBlock = ({
  evaluations,
  controles,
  evenementsIndesirablesGraves,
}: Props): ReactElement => {
  const getLastVisitInMonths = (): number => {
    const lastEvaluationDate = dayjs(evaluations[0].date);
    const lastControleDate = dayjs(controles[0].date);
    const mostRecentVisit = lastEvaluationDate.isBefore(lastControleDate)
      ? lastControleDate
      : lastEvaluationDate;
    return dayjs(dayjs()).diff(mostRecentVisit, "month");
  };

  return (
    <Block title="Controle qualité" iconClass="fr-icon-search-line">
      <div className="d-flex">
        <div className="fr-pr-2w">
          <InformationCard
            primaryInformation={`${getLastVisitInMonths()} mois`}
            secondaryInformation="depuis la dernière visite"
          />
        </div>
        <div className="fr-pr-2w">
          <InformationCard
            primaryInformation={`${evaluations[0].note}/5`}
            secondaryInformation="de moyenne à la dernière évaluation"
          />
        </div>
        <InformationCard
          primaryInformation={evenementsIndesirablesGraves.length}
          secondaryInformation="événements indésirables graves"
        />
      </div>
      <div className="fr-pt-3w">
        <Accordion
          label={
            <AccordionTitle
              title="Évaluations"
              lastVisit={evaluations[0].date}
            />
          }
          className={styles["custom-accordion"]}
        >
          <EvaluationTable evaluations={evaluations} />
        </Accordion>
        <Accordion
          label={
            <AccordionTitle
              title="Inspections-contrôles"
              lastVisit={controles[0].date}
            />
          }
          className={styles["custom-accordion"]}
        >
          <ControleTable controles={controles} />
        </Accordion>
        <Accordion
          label={
            <AccordionTitle
              title="Événements indésirables graves"
              lastVisit={evenementsIndesirablesGraves[0].evenementDate}
            />
          }
          className={styles["custom-accordion"]}
        >
          <EIGTable
            evenementsIndesirablesGraves={evenementsIndesirablesGraves}
          />
          <span className="fr-text--sm fr-m-1w">
            Pour connaître le détail d’un EIG, consultez le sur{" "}
            <Link
              href="https://www.demarches-simplifiees.fr/"
              target="_blank"
              rel="noopener external"
              title="Démarches simplifiées"
            >
              <span className="underline">Démarches simplifiées</span>
            </Link>{" "}
            avec le numéro de dossier correspondant.
          </span>
        </Accordion>
      </div>
    </Block>
  );
};

type Props = {
  evaluations: Evaluation[];
  controles: Controle[];
  evenementsIndesirablesGraves: EvenementIndesirableGrave[];
};
