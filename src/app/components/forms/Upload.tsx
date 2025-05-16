"use client";

import Button from "@codegouvfr/react-dsfr/Button";
import autoAnimate from "@formkit/auto-animate";
import React, { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import Loader from "@/app/components/ui/Loader";
import { cn } from "@/app/utils/classname.util";
import { FileUploadResponse, useFileUpload } from "@/app/hooks/useFileUpload";
import prettyBytes from "pretty-bytes";

const Upload = ({
  className,
  value,
  accept,
  onChange,
  category,
  ...props
}: UploadProps) => {
  const { uploadFile, getFile, deleteFile } = useFileUpload();

  const [state, setState] = useState<UploadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [file, setFile] = useState<FileDataType | undefined>(undefined);
  const [valueState, setValueState] = useState<string>("");

  useEffect(() => {
    const initialValue = value;

    if (initialValue) {
      async function syncFileData() {
        setState("loading");
        try {
          const fileData = await getFile(initialValue as string);
          setFile(fileData as FileDataType);
          setState("success");
        } catch {
          setState("error");
          setErrorMessage("Erreur lors de la récupération du fichier");
        }
      }
      syncFileData();

      setValueState(String(initialValue));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fileInputContainerRef = useRef(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<null | undefined> => {
    setState("loading");
    if (!event.target.files?.[0]) {
      setState("error");
      setErrorMessage("Veuillez sélectionner un fichier");
      return;
    }
    const file = event.target.files[0];
    try {
      const result = await uploadFile(file, new Date(), category || "");
      const fileData = await getFile(result.key);

      const stringKey = String(result.key);
      setValueState(stringKey);
      setFile(fileData);
      setState("success");
      setErrorMessage("");

      onChange?.({
        target: { value: stringKey },
      } as React.ChangeEvent<HTMLInputElement>);

      return;
    } catch {
      setState("error");
      setErrorMessage("Erreur lors de l'upload du fichier");
      return;
    }
  };

  useEffect(() => {
    if (fileInputContainerRef.current) {
      autoAnimate(fileInputContainerRef.current);
    }
    if (buttonRef.current) {
      autoAnimate(buttonRef.current);
    }
  }, [fileInputContainerRef, buttonRef]);

  const handleBrowse = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setState("deleting");
    try {
      if (valueState) {
        await deleteFile(valueState);
      }

      setState("idle");
      setFile(undefined);
      setValueState("");
      setErrorMessage("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onChange?.({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    } catch {
      setState("error");
      setErrorMessage("Erreur lors de la suppression du fichier");
    }
  };

  return (
    <div
      className={cn(
        "grid items-center justify-center bg-alt-blue-france p-4 rounded min-h-[4rem]",
        className
      )}
      ref={fileInputContainerRef}
    >
      {(state === "idle" || state === "loading") && (
        <span className="flex items-center justify-center gap-2">
          {state === "idle" ? "Pas de fichier" : "Chargement..."}

          <Button
            size="small"
            priority="tertiary no outline"
            className="bg-white"
            onClick={handleBrowse}
            disabled={state === "loading"}
            ref={buttonRef}
          >
            {state === "idle" ? "Parcourir" : <Loader />}
          </Button>
        </span>
      )}
      {state === "success" && (
        <span className="flex items-center justify-center gap-2">
          <i className="fr-icon-file-text-fill text-action-high-blue-france" />
          <span className="flex flex-col">
            <a href={file?.fileUrl}>{file?.originalName}</a>
            {file?.fileSize && (
              <span className="text-xs text-default-grey tabular-nums">
                {prettyBytes(file?.fileSize, { locale: "fr" })}
              </span>
            )}
          </span>
          <Button
            iconId="fr-icon-delete-bin-line"
            priority="tertiary no outline"
            size="small"
            className="!rounded-full !bg-white"
            title="Supprimer le fichier"
            onClick={handleDelete}
          />
        </span>
      )}
      {state === "error" && (
        <span className="flex items-center justify-center gap-2">
          <Button
            size="small"
            priority="tertiary no outline"
            className="bg-white"
            onClick={handleBrowse}
            ref={buttonRef}
          >
            Parcourir
          </Button>
          <p>{errorMessage}</p>
        </span>
      )}
      {state === "deleting" && (
        <span className="flex items-center justify-center gap-2">
          Suppression en cours...
        </span>
      )}
      <input
        className="hidden"
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
      />
      <input
        type="hidden"
        onChange={(e) => {
          onChange?.(e);
          setValueState(e.target.value);
        }}
        name={props.name}
        value={valueState}
        {...props}
      />
    </div>
  );
};

export default Upload;

type UploadState =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "uploaded"
  | "deleting";

type UploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, "multiple"> & {
  fileData?: FileDataType;
  category: string;
};

type FileDataType = FileUploadResponse & {
  fileUrl: string;
};
