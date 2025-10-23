import Button from "@codegouvfr/react-dsfr/Button";

import { FetchState } from "@/types/fetch-state.type";

export const AutoSaveStatus = ({ onStatusClick, saveState }: Props) => {
  return (
    <Button onClick={onStatusClick} className="fr-btn--tertiary-no-outline">
      {saveState === FetchState.LOADING && (
        <span className="fr-icon-more-fill text-mention-grey" />
      )}
      {saveState === FetchState.ERROR && (
        <span className="fr-icon-warning-line text-default-error" />
      )}
      {saveState === FetchState.IDLE && (
        <span className="fr-icon-save-line text-mention-grey" />
      )}
    </Button>
  );
};

type Props = {
  onStatusClick: () => void;
  saveState: FetchState;
};
