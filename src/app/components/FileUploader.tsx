"use client";
import { ReactElement } from "react";
import { useFileUpload } from "../hooks/useFileUpload";

export const FileUploader = (): ReactElement => {
  const { uploadFile, getDownloadLink } = useFileUpload();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<string | undefined> => {
    if (!event.target.files?.[0]) {
      return "Echec de l'envoi du fichier";
    }
    const file = event.target.files[0];
    return uploadFile(file, new Date(), "CPOM");
  };

  const getLink = () => {
    getDownloadLink(
      "f1928103-0a9a-4a54-9d3c-58b17c028c9d-Signature électronique.png"
    );
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={getLink}>TEST</button>
    </div>
  );
};
