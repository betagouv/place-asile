import { ReactElement } from "react";

export const FileItem = ({ file, title }: FileItemProps): ReactElement => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-title-blue-france text-sm font-medium mb-0 ">
        {title}
      </h3>
      {file ? (
        <p className="flex gap-2 items-center ">
          <i className="fr-icon-file-text-fill text-action-high-blue-france"></i>
          <span className="flex flex-col gap-1">
            <span className="text-sm">{file.name}</span>
            <span className="text-xs text-disabled-grey">{file.size} Mo</span>
          </span>
        </p>
      ) : (
        <p className="text-disabled-grey flex gap-1 text-sm items-center ">
          <i className="fr-icon-close-circle-fill"></i>Pas de fichier
        </p>
      )}
    </div>
  );
};

type FileItemProps = {
  title: string;
  file?: {
    name: string;
    size: number;
  };
};
