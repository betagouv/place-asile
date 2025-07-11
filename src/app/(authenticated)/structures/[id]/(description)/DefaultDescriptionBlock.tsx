import { Block } from "@/app/components/common/Block";
import { ReactElement } from "react";
import { ContactsViewer } from "./ContactsViewer";
import { AdressesViewer } from "./AdressesViewer";
import { useStructureContext } from "../context/StructureClientContext";
import { PublicType } from "@/types/structure.type";
import { getOperateurLabel } from "@/app/utils/structure.util";

export const DefaultDescriptionBlock = (): ReactElement => {
  const { structure } = useStructureContext();

  const {
    creationDate,
    dnaCode,
    filiale,
    operateur,
    public: publicValue,
    type,
    finessCode,
    cpom,
    lgbt,
    fvvTeh,
  } = structure;

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
          {type}
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
            {finessCode.replaceAll(" ", "")}
          </div>
        )}
      </div>
      <hr />
      <div className="flex mb-2">
        <div className="flex-1">
          <strong className="pr-2">Opérateur</strong>
          {getOperateurLabel(filiale, operateur)}
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
          {PublicType[String(publicValue) as keyof typeof PublicType]}
        </div>
        <div className="flex-1">
          <strong className="pr-2">Vulnérabilité</strong>
          {getVulnerabiliteLabel()}
        </div>
      </div>
      <hr />
      <div className="mb-2">
        <ContactsViewer />
      </div>
      <hr />
      <div>
        <AdressesViewer />
      </div>
    </Block>
  );
};
