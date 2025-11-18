import prettyBytes from "pretty-bytes";
import { ReactElement } from "react";

import { useFileUpload } from "@/app/hooks/useFileUpload";
import { getCategoryLabel } from "@/app/utils/file-upload.util";
import { ActeAdministratifApiType } from "@/schemas/api/acteAdministratif.schema";
import { DocumentFinancierApiType } from "@/schemas/api/documentFinancier.schema";
import { FileUploadCategoryType } from "@/types/file-upload.type";

export const DownloadItem = ({ fileUpload }: Props): ReactElement => {
  if (fileUpload.category !== "AUTRE") {
    console.log("fileUpload", fileUpload);
  }
  const { getDownloadLink } = useFileUpload();

  const getFileType = (filename: string): string => {
    const extension = filename.split(".").pop() || "";
    return extension.toUpperCase();
  };

  const openLink = async () => {
    const link = await getDownloadLink(fileUpload.key);
    window.open(link);
  };

  const getFileLabel = (): string => {
    if (
      "categoryName" in fileUpload &&
      fileUpload.categoryName &&
      fileUpload.categoryName !== "Document"
    ) {
      return fileUpload?.categoryName;
    } else {
      const categoryLabel = getCategoryLabel(
        fileUpload.category as unknown as FileUploadCategoryType[number]
      );
      const startYear = new Date(
        "startDate" in fileUpload ? fileUpload.startDate || "" : ""
      ).getFullYear();
      const endYear = new Date(
        "endDate" in fileUpload ? fileUpload.endDate || "" : ""
      ).getFullYear();
      if (isNaN(startYear) || isNaN(endYear)) {
        return categoryLabel;
      }
      return `${categoryLabel} ${startYear} - ${endYear}`;
    }
  };

  console.log("getFileLabel", getFileLabel());

  return (
    <div className="inline">
      <button onClick={openLink} className="underline text-title-blue-france">
        <div className="flex text-left">
          {getFileLabel()} <span className="pl-2 fr-icon-eye-line" />
        </div>
      </button>
      <div>
        {getFileType(fileUpload.originalName || "")} -{" "}
        {prettyBytes(fileUpload.fileSize || 0)}
      </div>
    </div>
  );
};

type Props = {
  fileUpload: ActeAdministratifApiType | DocumentFinancierApiType;
};
