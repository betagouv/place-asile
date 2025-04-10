import { StructureType } from "@/types/structure.type";
import Link from "next/link";
import { ReactElement, forwardRef, ForwardedRef } from "react";
import { NavigationMenu } from "./NavigationMenu";
import styles from "./StructureHeader.module.css";

const StructureHeaderComponent = forwardRef(
  (
    { type, operateur, nbPlaces, nom, commune, departement }: Props,
    ref: ForwardedRef<HTMLDivElement>
  ): ReactElement => {
    return (
      <div className={styles.container} ref={ref}>
        <div className="d-flex border-bottom fr-p-1w">
          <Link
            className="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-left-s-line"
            title="Retour aux structures d’hébergement"
            href="/structures"
          >
            Retour aux structures d’hébergement
          </Link>
          <div>
            <h2 className="text-blue-france fr-text--xs uppercase fr-mb-0">
              <strong className="fr-pr-2w">Structure hébergement</strong>
            </h2>
            <h3 className="text-blue-france fr-h6 fr-mb-0">
              <strong className="fr-pr-1w">
                {type}, {operateur}, {nbPlaces} places
              </strong>
              <span className="fr-pr-1w">{" – "}</span>
              <span className="fr-mb-0 text-black fr-text--lg italic weight-normal">
                {nom ? `${nom}, ` : ""} {commune}, {departement}
              </span>
            </h3>
          </div>
        </div>
        <NavigationMenu />
      </div>
    );
  }
);

StructureHeaderComponent.displayName = "StructureHeader";

export const StructureHeader = StructureHeaderComponent;

type Props = {
  type: StructureType;
  operateur: string;
  nbPlaces: number;
  nom: string | null;
  commune: string;
  departement: string;
};
