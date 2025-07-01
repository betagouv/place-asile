import { useFileUpload } from "@/app/hooks/useFileUpload";
import { getCategoryLabel } from "@/app/utils/file-upload.util";
import { FileUpload, FileUploadCategory } from "@/types/file-upload.type";
import prettyBytes from "pretty-bytes";
import { ReactElement } from "react";

export const DownloadItem = ({ fileUpload }: Props): ReactElement => {
  const { getDownloadLink } = useFileUpload();

  const getFileType = (filename: string): string => {
    const extension = filename.split(".").pop() || "";
    return extension.toUpperCase();
  };

  const openLink = async () => {
    const link = await getDownloadLink(fileUpload.key);
    window.open(link);
  };

  return (
    <div className="inline">
      <button onClick={openLink} className="underline text-title-blue-france">
        <div className="flex text-left">
          {getCategoryLabel(
            fileUpload.category as unknown as keyof typeof FileUploadCategory
          )}{" "}
          <span className="pl-2 fr-icon-eye-line" />
        </div>
      </button>
      <div>
        {getFileType(fileUpload.originalName)} -{" "}
        {prettyBytes(fileUpload.fileSize)}
      </div>
    </div>
  );
};

type Props = {
  fileUpload: FileUpload;
};
