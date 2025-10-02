import React from "react";

export const ModificationTitle = ({ step }: { step: string }) => {
  return (
    <div>
      <h1 className="text-xl font-bold my-3 ml-6 text-title-blue-france">
        <span
          className="fr-icon-edit-line fr-icon--md before:h-5 before:w-5"
          aria-hidden="true"
        />
        <span className="italic font-normal"> Modification</span> - {step}
      </h1>
    </div>
  );
};
