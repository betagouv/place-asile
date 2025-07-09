import Link from "next/link";
import {
  useFiles,
  FileMetaData,
  UploadsByCategoryFileData,
} from "./FilesContext";
import { UploadsByCategoryFile } from "./UploadsByCategoryFile";

export const UploadsByCategoryContent = ({
  categoryId,
  categoryShortName,
  fieldBaseName,
  title,
  addFileButtonLabel,
  fileMetaData,
  isOptional,
  canAddFile,
  canAddAvenant,
  documentLabel = "Document",
}: Omit<UploadsByCategoryProps, "files">) => {
  const { files, addFile } = useFiles();

  const handleAddFile = (e: React.MouseEvent) => {
    e.preventDefault();
    addFile();
  };

  return (
    <fieldset className="flex flex-col gap-6 w-full">
      <legend className="text-xl font-bold mb-4 text-title-blue-france">
        {title} {isOptional && "(optionnel)"}
      </legend>
      {files &&
        files.length > 0 &&
        files.map((file, index) => (
          <UploadsByCategoryFile
            key={`file-${categoryId}-${index}`}
            file={file}
            categoryId={categoryId}
            categoryShortName={categoryShortName}
            fieldBaseName={fieldBaseName}
            documentLabel={documentLabel}
            canAddAvenant={canAddAvenant || false}
            fileMetaData={fileMetaData || FileMetaData.DATE_TYPE}
            isOptional={isOptional || false}
            index={index}
          />
        ))}
      {canAddFile && (
        <Link
          href={"/"}
          className="text-action-high-blue-france underline underline-offset-4 mt-8"
          onClick={handleAddFile}
        >
          + {addFileButtonLabel}
        </Link>
      )}
    </fieldset>
  );
};

export type UploadsByCategoryProps = {
  categoryId: string;
  categoryShortName: string;
  fieldBaseName: string;
  title: string;
  documentLabel?: string;
  hasAvenants?: boolean;
  fileMetaData?: FileMetaData;
  info?: string;
  isOptional?: boolean;
  canAddFile?: boolean;
  addFileButtonLabel?: string;
  canAddAvenant?: boolean;
  files?: UploadsByCategoryFileData[];
};
