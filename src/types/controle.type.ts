import { FileUpload } from "./file-upload.type";

export type Controle = {
  id: number;
  structureDnaCode: string;
  date: Date;
  type: ControleType;
  fileUploads: FileUpload[];
  createdAt?: Date;
  lastUpdate?: Date;
};

export enum ControleType {
  INOPINE = "Inopiné",
  PROGRAMME = "Programmé",
}
