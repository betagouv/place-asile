import { Block } from "@/app/components/common/Block";
import { ReactElement } from "react";
import { ContactsViewer } from "./ContactsViewer";
import { Contact } from "@/types/contact.type";
import { PublicType, StructureType } from "@/types/structure.type";
import { Repartition } from "@/types/adresse.type";

export const PrahdaDescriptionBlock = ({
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
  contacts,
}: Props): ReactElement => {
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
        <div className="flex-1">
          <strong className="pr-2">Opérateur</strong>
          {operateur}
        </div>
      </div>
      <hr />
      <div className="flex mb-2">
        <div className="flex-1">
          <strong className="pr-2">Public</strong>
          {PublicType[publicType as unknown as keyof typeof PublicType]}
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
      <div className="flex mb-2">
        <strong className="pr-2">Type de bâti</strong>
        <span className="pr-1">{repartition}</span>
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
  contacts: Contact[];
};
