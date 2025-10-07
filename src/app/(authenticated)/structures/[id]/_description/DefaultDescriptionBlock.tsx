import { useRouter } from "next/navigation";
import { ReactElement } from "react";

import { Block } from "@/app/components/common/Block";
import { getOperateurLabel } from "@/app/utils/structure.util";
import { PublicType, StructureState } from "@/types/structure.type";

import { useStructureContext } from "../context/StructureClientContext";
import { AdressesViewer } from "./AdressesViewer";
import { ContactsViewer } from "./ContactsViewer";

export const DefaultDescriptionBlock = (): ReactElement => {
  const { structure } = useStructureContext();
  const router = useRouter();
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
    state,
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
    <Block
      title="Description"
      iconClass="fr-icon-menu-2-fill"
      onEdit={
        state === StructureState.FINALISE
          ? () => {
              router.push(
                `/structures/${structure.id}/modification/01-description`
              );
            }
          : undefined
      }
    >
      <div className="flex mb-2">
        <div className="flex-1">
          <strong className="pr-2">Date de création</strong>
          {new Date(creationDate).toLocaleDateString("fr-FR")}
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
          {getOperateurLabel(filiale, operateur?.name)}
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
