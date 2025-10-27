import { AgentFileUploadCategoryType } from "./file-upload.type";

export type CategoryDisplayRulesType = Record<
  AgentFileUploadCategoryType[number],
  {
    categoryShortName: string;
    title: string;
    canAddFile: boolean;
    canAddAvenant: boolean;
    isOptional: boolean;
    additionalFieldsType: AdditionalFieldsType;
    documentLabel: string;
    addFileButtonLabel: string;
    notice?: string | React.ReactElement;
  }
>;

export enum AdditionalFieldsType {
  INSPECTION_CONTROLE,
  EVALUATION,
  DATE_START_END,
  NAME,
}
