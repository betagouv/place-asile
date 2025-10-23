import Button from "@codegouvfr/react-dsfr/Button";

import { FetchState } from "@/types/fetch-state.type";

export const AutoSaveStatus = ({ onStatusClick, saveState }: Props) => {
  return (
    <Button onClick={onStatusClick} className="fr-btn--tertiary-no-outline">
      {saveState === FetchState.LOADING && (
        <span className="fr-icon-refresh-line text-mention-grey" />
      )}
      {saveState === FetchState.ERROR && (
        <span className="fr-icon-warning-line text-default-error" />
      )}
      {saveState === FetchState.IDLE && (
        <span className="text-mention-grey">
          <svg
            width="24"
            height="24"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.5 5.83301V16.667C17.4998 17.127 17.127 17.4998 16.667 17.5H3.33301C2.87303 17.4998 2.50018 17.127 2.5 16.667V3.33301C2.50018 2.87303 2.87303 2.50018 3.33301 2.5H14.167L17.5 5.83301ZM4.16699 15.833H5.83301V10.833H14.167V15.833H15.833V6.52344L13.4766 4.16699H4.16699V15.833ZM7.5 15.833H12.5V12.5H7.5V15.833ZM13.0889 6.42285L9.16699 10.3447L6.91113 8.08887L8.08887 6.91113L9.16699 7.98828L11.9111 5.24414L13.0889 6.42285Z"
              fill="#666666"
            />
          </svg>
        </span>
      )}
    </Button>
  );
};

type Props = {
  onStatusClick: () => void;
  saveState: FetchState;
};
