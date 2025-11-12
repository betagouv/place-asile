import Link from "next/link";
import { ReactElement } from "react";

import { useFileUpload } from "@/app/hooks/useFileUpload";

export const SeeFileButton = ({ fileUploadKey }: Props): ReactElement => {
  const { getDownloadLink } = useFileUpload();

  const openLink = async (fileUploadKey: string) => {
    const link = await getDownloadLink(fileUploadKey);
    window.open(link);
  };

  return (
    <Link
      className="fr-btn fr-btn--tertiary-no-outline fr-icon-eye-line fr-btn--icon-left"
      href="#"
      onClick={() => openLink(fileUploadKey)}
    >
      Voir
    </Link>
  );
};

type Props = {
  fileUploadKey: string;
};
