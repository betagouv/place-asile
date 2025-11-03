import { ReactElement } from "react";

import { PLACE_ASILE_CONTACT_EMAIL } from "@/constants";

export const SubmitError = ({
  id,
  backendError,
}: Props): ReactElement => {
  const getErrorEmail = (error: string | undefined): string => {
    const subject = `Problème avec le formulaire de Place d'asile (code structure ${id})`;
    const body = `Bonjour,%0D%0A%0D%0AAjoutez ici des informations supplémentaires...%0D%0A%0D%0ARapport d'erreur: ${error}`;
    return `mailto:${PLACE_ASILE_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex items-end flex-col">
      <p className="text-default-error m-0 p-0">
        Une erreur s’est produite.{" "}
        <a
          href={getErrorEmail(backendError)}
          className="underline"
          target="_blank"
        >
          Nous prévenir
        </a>
      </p>
    </div>
  );
};

type Props = {
  id: number;
  backendError?: string;
};
