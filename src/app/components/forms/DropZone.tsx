import { Button } from "@codegouvfr/react-dsfr/Button";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

import { FileUploadWithLink, useFileUpload } from "@/app/hooks/useFileUpload";
import { cn } from "@/app/utils/classname.util";
import { getShortDisplayedName } from "@/app/utils/file-upload.util";

import Loader from "../ui/Loader";

export const DropZone = ({ className, onChange, children }: Props) => {
  const { uploadFile, getFile, deleteFile } = useFileUpload();

  const [currentState, setCurrentState] = useState<State>("idle");
  const [currentErrorMessage, setCurrentErrorMessage] = useState<string>("");
  const [fileData, setFileData] = useState<FileUploadWithLink | null>(null);
  const [key, setKey] = useState<string | null>(null);

  const handleDrop = async (files: File[]) => {
    if (files.length === 0) {
      setCurrentState("error");
      setCurrentErrorMessage("Veuillez sélectionner un fichier");
      return;
    }

    const file = files[0];
    setCurrentState("loading");

    try {
      const result = await uploadFile(file);
      const fileData = await getFile(result.key);

      setKey(result.key);
      setFileData(fileData);
      setCurrentState("success");
      setCurrentErrorMessage("");

      onChange?.({ key: result.key });
    } catch {
      setCurrentState("error");
      setCurrentErrorMessage("Erreur lors de l'upload du fichier");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentState("loading");
    try {
      if (key) {
        await deleteFile(key);
        setKey(null);
        setFileData(null);
        setCurrentErrorMessage("");
        setCurrentState("idle");
        onChange?.({ key: undefined });
      }
    } catch {
      setCurrentState("error");
      setCurrentErrorMessage("Erreur lors de la suppression du fichier");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

  if (currentState === "success" && key) {
    return (
      <div className={cn(wrapperClassName, className)}>
        <div className="flex gap-2 items-center mb-6">
          <span className="fr-icon-file-text-fill text-title-blue-france" />
          <p className="mb-0">
            <span>{getShortDisplayedName(fileData?.originalName)}</span>
            <span className="text-disabled-grey text-xs block">
              {fileData?.fileSize
                ? prettyBytes(fileData?.fileSize, { locale: "fr" })
                : ""}
            </span>
          </p>

          <Button
            iconId="fr-icon-delete-bin-line"
            priority="tertiary no outline"
            size="small"
            className="!rounded-full !bg-white"
            title="Supprimer le fichier"
            onClick={handleDelete}
          />
        </div>
        {children}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(wrapperClassName, "border-dashed", className)}
    >
      <div className="flex flex-col items-center gap-3">
        <input {...getInputProps()} />
        <span className="fr-icon-file-add-fill [&::before]:[--icon-size:2.5rem] text-title-blue-france mb-3" />
        {currentState === "loading" ? (
          <Loader />
        ) : (
          <p className="text-center mb-0">
            <strong>Glisser déposer</strong> ou
            <br />
            <span className="text-title-blue-france underline">
              cliquer pour ajouter un fichier
            </span>
          </p>
        )}
        <span className="text-center text-disabled-grey text-sm">
          PDF, XLS, XLSX, CSV et ODS seulement - Taille maximale : 10 Mo
        </span>
        {currentErrorMessage && (
          <span className="text-center text-default-error text-sm">
            {currentErrorMessage}
          </span>
        )}
      </div>
      {children}
    </div>
  );
};

const wrapperClassName =
  "flex flex-col justify-center items-center w-full h-full bg-alt-blue-france p-4 rounded border border-action-high-blue-france";
type Props = {
  className?: string;
  onChange: (data: { key?: string }) => void;
  children: React.ReactNode;
};

type State = "idle" | "loading" | "success" | "error";
