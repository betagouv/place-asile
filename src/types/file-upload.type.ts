import { FileUploadCategory } from "@prisma/client";

// Re-export the Prisma enum for consistency
export { FileUploadCategory };

export type FileUpload = {
  id: number;
  structureDnaCode?: string;
  key: string;
  mimeType: string;
  fileSize: number;
  originalName: string;
  date?: Date;
  category?: FileUploadCategory;
  startDate?: Date;
  endDate?: Date;
  categoryName?: string;
  parentFileUploadId?: string;
  childrenFileUploads?: FileUpload[];
};
