import { Block } from "@/app/components/common/Block";
import { ReactElement } from "react";

export const DescriptionBlock = ({
  creationDate,
  dnaCode,
  operateur,
  publicType,
  adresse,
  nom,
  codePostal,
  commune,
  repartition,
  type,
  finessCode,
  cpom,
  lgbt,
  fvv,
  teh,
}: Props): ReactElement => {
  const getVulnerabiliteLabel = () => {
    const vulnerabilites: string[] = [];
    const categories = [
      { isInCentre: lgbt, label: "LGBT" },
      { isInCentre: fvv, label: "FVV" },
      { isInCentre: teh, label: "TEH" },
    ];
    categories.forEach((category) => {
      if (category.isInCentre) {
        vulnerabilites.push(category.label);
      }
    });
    return vulnerabilites.join(", ");
  };

  return (
    <Block title="Description" iconClass="fr-icon-menu-2-fill">
      <div className="fr-grid-row">
        <div className="fr-col">
          <div className="fr-mb-1w">
            <strong className="fr-pr-2w">Date de création</strong>
            {new Date(creationDate).toLocaleDateString()}
          </div>
        </div>
        <div className="fr-col">
          <div className="fr-mb-1w">
            <strong className="fr-pr-2w">Type de structure</strong>
            {type}
          </div>
        </div>
      </div>
      <hr />
      <div className="fr-grid-row">
        <div className="fr-col">
          <div className="fr-mb-1w">
            <strong className="fr-pr-2w">Code DNA (OFII)</strong>
            {dnaCode}
          </div>
        </div>
        <div className="fr-col">
          <div className="fr-mb-1w">
            <strong className="fr-pr-2w">Code FINESS</strong>
            {finessCode}
          </div>
        </div>
      </div>
      <hr />
      <div className="fr-grid-row">
        <div className="fr-col">
          <div className="fr-mb-1w">
            <strong className="fr-pr-2w">Opérateur</strong>
            {operateur}
          </div>
        </div>
        <div className="fr-col">
          <div className="fr-mb-1w">
            <strong className="fr-pr-2w">CPOM</strong>
            {cpom ? "Oui" : "Non"}
          </div>
        </div>
      </div>
      <hr />
      <div className="fr-grid-row">
        <div className="fr-col">
          <div className="fr-mb-1w">
            <strong className="fr-pr-2w">Public</strong>
            {publicType}
          </div>
        </div>
        <div className="fr-col">
          <div className="fr-mb-1w">
            <strong className="fr-pr-2w">Vulnérabilité</strong>
            {getVulnerabiliteLabel()}
          </div>
        </div>
      </div>
      <hr />
      <div className="fr-mb-1w">
        <strong className="fr-pr-2w">Adresse administrative</strong>
        <span className="fr-pr-1w">
          {nom}, {adresse}, {codePostal} {commune}
        </span>
        <button className="fr-btn fr-btn--sm fr-btn--icon-left fr-btn--tertiary-no-outline fr-icon-eye-line">
          Voir les contacts
        </button>
      </div>
      <hr />
      <div>
        <strong className="fr-pr-2w">Type de bâti</strong>
        <span className="fr-pr-1w">{repartition}</span>
        <button className="fr-btn fr-btn--sm fr-btn--icon-left fr-btn--tertiary-no-outline fr-icon-eye-line">
          Voir la liste des hébergements
        </button>
      </div>
    </Block>
  );
};

type Props = {
  creationDate: Date;
  dnaCode: string;
  operateur: string;
  publicType: string;
  adresse: string;
  nom: string | null;
  codePostal: string;
  commune: string;
  repartition: string;
  type: string;
  finessCode: string;
  cpom: boolean;
  lgbt: boolean;
  fvv: boolean;
  teh: boolean;
};
