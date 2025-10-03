import { Button } from "@codegouvfr/react-dsfr/Button";
import React from "react";

export const ModificationTitle = ({
  step,
  closeLink,
}: {
  step: string;
  closeLink: string;
}) => {
  return (
    <div className="flex justify-between items-center mx-6 my-3">
      <h1 className="text-xl font-bold mb-0 text-title-blue-france">
        <span
          className="fr-icon-edit-line fr-icon--md before:h-5 before:w-5"
          aria-hidden="true"
        />
        <span className="italic font-normal"> Modification</span> - {step}
      </h1>
      <a href={closeLink}>
        <span className="fr-icon-close-line fr-icon--md text-title-blue-france" />
      </a>
    </div>
  );
};
