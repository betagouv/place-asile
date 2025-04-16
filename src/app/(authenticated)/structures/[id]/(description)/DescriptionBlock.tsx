import { Block } from "@/app/components/common/Block";
import { ReactElement } from "react";
import { ContactsViewer } from "./ContactsViewer";
import { Contact } from "@/types/contact.type";
import { AdressesViewer } from "./AdressesViewer";
import { PublicType, StructureType } from "@/types/structure.type";
import { Adresse, Repartition } from "@/types/adresse.type";

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
  fvvTeh,
  contacts,
  adresses,
}: Props): ReactElement => {
  const getVulnerabiliteLabel = () => {
    const vulnerabilites: string[] = [];
    if (lgbt) {
      vulnerabilites.push("LGBT");
    }
    if (fvvTeh) {
      vulnerabilites.push("FVV", "TEH");
    }
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
            {StructureType[type]}
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
            {PublicType[publicType as unknown as keyof typeof PublicType]}
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
        <ContactsViewer
          nom={nom}
          adresse={adresse}
          codePostal={codePostal}
          commune={commune}
          contacts={contacts}
        />
      </div>
      <hr />
      <div>
        <AdressesViewer repartition={repartition} adresses={adresses} />
      </div>
    </Block>
  );
};

type Props = {
  creationDate: Date;
  dnaCode: string;
  operateur: string;
  publicType: PublicType;
  adresse: string;
  nom: string | null;
  codePostal: string;
  commune: string;
  repartition: Repartition;
  type: StructureType;
  finessCode: string | null;
  cpom: boolean;
  lgbt: boolean;
  fvvTeh: boolean;
  contacts: Contact[];
  adresses: Adresse[];
};
