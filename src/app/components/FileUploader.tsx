"use client";
import { ReactElement } from "react";
import { useFileUpload } from "../hooks/useFileUpload";

export const FileUploader = (): ReactElement => {
  const { uploadFile } = useFileUpload();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<string | undefined> => {
    if (!event.target.files?.[0]) {
      return "Echec de l'envoi du fichier";
    }
    const file = event.target.files[0];
    return uploadFile(file);
  };

  return <input type="file" onChange={handleFileUpload} />;
};
