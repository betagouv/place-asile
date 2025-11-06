import Button from "@codegouvfr/react-dsfr/Button";
import { ReactElement } from "react";

import { useFileUpload } from "@/app/hooks/useFileUpload";

export const SeeFileButton = ({ fileUploadKey }: Props): ReactElement => {
  const { getDownloadLink } = useFileUpload();

  const openLink = async (fileUploadKey: string) => {
    const link = await getDownloadLink(fileUploadKey);
    window.open(link);
  };

  return (
    <Button
      iconId="fr-icon-eye-line"
      priority="tertiary no outline"
      onClick={() => openLink(fileUploadKey)}
    >
      Voir
    </Button>
  );
};

type Props = {
  fileUploadKey: string;
};
