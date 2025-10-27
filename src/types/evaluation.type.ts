import { FileUpload } from "./file-upload.type";

export type Evaluation = {
  id: number;
  structureDnaCode: string;
  date: Date;
  notePersonne: number | null;
  notePro: number | null;
  noteStructure: number | null;
  note: number | null;
  fileUploads: FileUpload[];
  createdAt?: Date;
  updatedAt?: Date;
};
