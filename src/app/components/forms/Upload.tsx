import Button from "@codegouvfr/react-dsfr/Button";
import autoAnimate from "@formkit/auto-animate";
import React, { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import Loader from "@/app/components/ui/Loader";
import { cn } from "@/app/utils/classname.util";

const Upload = ({
  onFileChange,
  onAbort,
  className,
  value,
  ...props
}: UploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const fileInputContainerRef = useRef(null);

  const initialState = value ? "success" : "idle";
  const [state, setState] = useState(initialState as UploadStates);

  useEffect(() => {
    if (value && state !== "success") {
      setState("success");
    } else if (!value && state === "success") {
      setState("idle");
    }
  }, [value, state]);

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

  const handleAbort = () => {
    setState("idle");
    onAbort?.();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState("loading");
    const file = e.target.files?.[0];
    // mock a timeout
    setTimeout(() => {
      setState("success");
    }, 2000);
    if (file) {
      onFileChange?.(file);
    }
  };

  return (
    <div
      className={cn(
        "grid items-center justify-center bg-alt-blue-france p-4 rounded",
        className
      )}
      ref={fileInputContainerRef}
    >
      {(state === "idle" || state === "loading") && (
        <span className="flex items-center justify-center gap-2">
          Pas de fichier{" "}
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
      {state === "success" && <span>Fichier chargé: {value}</span>}
      <input
        className="block display-none w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        type="file"
        ref={fileInputRef}
        onAbort={handleAbort}
        onChange={handleFileChange}
      />
      <input type="text" value={value || ""} {...props} />
    </div>
  );
};

export default Upload;

type UploadStates = "idle" | "loading" | "success" | "error" | "uploaded";

type UploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, "multiple"> & {
  onFileChange?: (file: File) => void;
  onAbort?: () => void;
};
