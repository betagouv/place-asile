import Button from "@codegouvfr/react-dsfr/Button";
import Tooltip from "@codegouvfr/react-dsfr/Tooltip";
import Link from "next/link";

import { EmptyCell } from "@/app/components/common/EmptyCell";
import { formatDate } from "@/app/utils/date.util";
import { getFinalisationFormStatus } from "@/app/utils/getFinalisationFormStatus.util";
import {
  getOperateurLabel,
  getPlacesByCommunes,
  getRepartition,
} from "@/app/utils/structure.util";
import { Structure } from "@/types/structure.type";

import { RepartitionBadge } from "./RepartitionBadge";

export const StructureItem = ({ structure, index, handleOpenModal }: Props) => {
  const isStructureFinalized = getFinalisationFormStatus(structure);

  return (
    <tr
      id={`table-row-key-${index}`}
      data-row-key={index}
      className="border-t-1 border-default-grey"
    >
      <td>{structure.dnaCode}</td>
      <td>{structure.type}</td>
      <td>{getOperateurLabel(structure.filiale, structure.operateur?.name)}</td>
      <td>{structure.structureTypologies?.[0].placesAutorisees}</td>
      <td>
        <RepartitionBadge repartition={getRepartition(structure)} />
      </td>
      <td>{getCommuneLabel(structure)}</td>
      {structure.debutConvention && structure.finConvention ? (
        <td>
          {formatDate(structure.debutConvention)} -{" "}
          {formatDate(structure.finConvention)}
        </td>
      ) : (
        <EmptyCell />
      )}
      <td>
        {isStructureFinalized ? (
          <Link
            className="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-right-line"
            title={`Détails de la structure ${structure.dnaCode}`}
            href={`structures/${structure.id}`}
          >
            Détails de la structure {structure.dnaCode}
          </Link>
        ) : (
          <Button
            onClick={() => handleOpenModal(structure)}
            className="fr-btn--tertiary-no-outline fr-icon-edit-line"
            title={`Finaliser la création de la structure ${structure.dnaCode}`}
          >
            Finaliser la création de la structure {structure.dnaCode}
          </Button>
        )}
      </td>
    </tr>
  );
};

const getCommuneLabel = (structure: Structure) => {
  const placesByCommune = getPlacesByCommunes(structure.adresses || []);
  const mainCommune = Object.keys(placesByCommune)[0];
  const communesWithoutMainCommune = Object.keys(placesByCommune).filter(
    (commune) => commune !== mainCommune
  );
  return (
    <>
      <span>{mainCommune} </span>
      {mainCommune && communesWithoutMainCommune.length > 0 && (
        <span className="underline text-mention-grey inline-flex ms-1">
          <Tooltip title={communesWithoutMainCommune.join(", ")}>
            {communesWithoutMainCommune.length} autres
          </Tooltip>
        </span>
      )}
    </>
  );
};

type Props = {
  structure: Structure;
  index: number;
  handleOpenModal: (structure: Structure) => void;
};
