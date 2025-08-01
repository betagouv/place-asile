import { FilesProvider } from "./FilesContext";
import {
  UploadsByCategoryContent,
  UploadsByCategoryProps,
} from "./UploadsByCategoryContent";

export const UploadsByCategory = ({
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
  files,
  subTitle,
}: UploadsByCategoryProps) => {
  return (
    <FilesProvider initialFiles={files || []}>
      <UploadsByCategoryContent
        categoryId={categoryId}
        categoryShortName={categoryShortName}
        fieldBaseName={fieldBaseName}
        title={title}
        addFileButtonLabel={addFileButtonLabel}
        fileMetaData={fileMetaData}
        isOptional={isOptional}
        canAddFile={canAddFile}
        canAddAvenant={canAddAvenant}
        documentLabel={documentLabel}
        subTitle={subTitle}
      />
    </FilesProvider>
  );
};
