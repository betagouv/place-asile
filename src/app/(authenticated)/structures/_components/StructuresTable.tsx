"use client";

import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useRouter } from "next/navigation";
import { ReactElement, useState } from "react";

import { Pagination } from "@/app/components/common/Pagination";
import { Table } from "@/app/components/common/Table";
import { usePagination } from "@/app/hooks/usePagination";
import { Structure } from "@/types/structure.type";

import { StructureItem } from "./StructureItem";

const finalisationModal = createModal({
  id: "finalisation-modal",
  isOpenedByDefault: false,
});

export const StructuresTable = ({
  structures,
  ariaLabelledBy,
}: Props): ReactElement => {
  const { currentPage, setCurrentPage, totalPages, currentData } =
    usePagination<Structure>(structures);

  const router = useRouter();

  const headings = [
    "DNA",
    "Type",
    "Opérateur",
    "Places aut.",
    "Bâti",
    "Communes",
    "Convention en cours",
    "Détails",
  ];

  const [selectedStructure, setSelectedStructure] = useState<Structure | null>(
    null
  );

  const handleOpenModal = (structure: Structure) => {
    setSelectedStructure(structure);
    finalisationModal.open();
  };

  return (
    <>
      <div className="p-4 bg-alt-grey h-full">
        <Table
          headings={headings}
          ariaLabelledBy={ariaLabelledBy}
          className="[&_tr]:!bg-transparent"
        >
          {currentData.map((structure, index) => (
            <StructureItem
              key={index + structure.id}
              structure={structure}
              index={index}
              handleOpenModal={handleOpenModal}
            />
          ))}
        </Table>
        <div className="pt-4 flex justify-center items-center">
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
      <finalisationModal.Component
        title="Veuillez finaliser la création de cette structure."
        buttons={[
          {
            doClosesModal: true,
            children: "Annuler",
            type: "button",
          },
          {
            doClosesModal: false,
            children: "Je finalise la création",
            type: "button",
            onClick: () =>
              router.push(
                `/structures/${selectedStructure?.id}/finalisation/01-identification`
              ),
          },
        ]}
      >
        <p>
          La création de cette structure n’est pas terminée : son opérateur a
          transmis les données demandées mais celles-ci doivent être vérifiées
          et complétées par un agent ou une agente.
        </p>
      </finalisationModal.Component>
    </>
  );
};

type Props = {
  structures: Structure[];
  ariaLabelledBy: string;
};
