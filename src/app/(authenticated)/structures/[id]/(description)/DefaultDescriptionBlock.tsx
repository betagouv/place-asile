import { Block } from "@/app/components/common/Block";
import { ReactElement } from "react";
import { ContactsViewer } from "./ContactsViewer";
import { Contact } from "@/types/contact.type";
import { AdressesViewer } from "./AdressesViewer";
import { PublicType, StructureType } from "@/types/structure.type";
import { Adresse, Repartition } from "@/types/adresse.type";

export const DefaultDescriptionBlock = ({
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
    return vulnerabilites.join(", ") || "N/A";
  };

  return (
    <Block title="Description" iconClass="fr-icon-menu-2-fill">
      <div className="flex mb-2">
        <div className="flex-1">
          <strong className="pr-2">Date de création</strong>
          {new Date(creationDate).toLocaleDateString()}
        </div>
        <div className="flex-1">
          <strong className="pr-2">Type de structure</strong>
          {StructureType[type]}
        </div>
      </div>
      <hr />
      <div className="flex mb-2">
        <div className="flex-1">
          <strong className="pr-2">Code DNA (OFII)</strong>
          {dnaCode}
        </div>
        {finessCode && (
          <div className="flex-1">
            <strong className="pr-2">Code FINESS</strong>
            {finessCode}
          </div>
        )}
      </div>
      <hr />
      <div className="flex mb-2">
        <div className="flex-1">
          <strong className="pr-2">Opérateur</strong>
          {operateur}
        </div>
        <div className="flex-1">
          <strong className="pr-2">CPOM</strong>
          {cpom ? "Oui" : "Non"}
        </div>
      </div>
      <hr />
      <div className="flex mb-2">
        <div className="flex-1">
          <strong className="pr-2">Public</strong>
          {PublicType[publicType as unknown as keyof typeof PublicType]}
        </div>
        <div className="flex-1">
          <strong className="pr-2">Vulnérabilité</strong>
          {getVulnerabiliteLabel()}
        </div>
      </div>
      <hr />
      <div className="mb-2">
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
