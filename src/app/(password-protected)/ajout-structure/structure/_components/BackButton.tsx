import Button from "@codegouvfr/react-dsfr/Button";
import { ReactElement } from "react";

export const BackButton = (): ReactElement => {
  const handleBack = () => {
    window.location.reload();
  };
  return (
    <Button
      type="button"
      onClick={handleBack}
      className="fr-btn--tertiary-no-outline underline flex gap-1"
    >
      <span className="fr-icon-arrow-left-line fr-icon--sm " />
      Retour
    </Button>
  );
};
