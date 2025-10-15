import { AgentFileUploadCategory, FileMetaData } from "./file-upload.type";

export type CategoryDisplayRulesType = Record<
  (typeof AgentFileUploadCategory)[number],
  {
    categoryShortName: string;
    title: string;
    canAddFile: boolean;
    canAddAvenant: boolean;
    isOptional: boolean;
    fileMetaData: FileMetaData;
    documentLabel: string;
    addFileButtonLabel: string;
    notice?: string | React.ReactElement;
  }
>;
