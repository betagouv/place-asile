import { FileUpload } from "@/types/file-upload.type";

export const createFileUpload = ({
  id,
  key,
  structureDnaCode,
  category,
  originalName,
  ...overrides
}: Partial<FileUpload> = {}): FileUpload => {
  return {
    id: id ?? 1,
    key: key ?? "test-file-key-123",
    structureDnaCode: structureDnaCode ?? "C0001",
    mimeType: "application/pdf",
    fileSize: 1024000,
    originalName: originalName ?? "test-document.pdf",
    category: category ?? ("CONVENTION" as const),
    date: new Date("2024-01-15"),
    parentFileUploadId: null,
    ...overrides,
  };
};

export const createFileUploadArray = (
  count: number,
  category?: FileUpload["category"]
): FileUpload[] => {
  return Array.from({ length: count }, (_, i) =>
    createFileUpload({
      id: i + 1,
      key: `test-file-key-${i + 1}`,
      originalName: `document-${i + 1}.pdf`,
      category: category ?? ("CONVENTION" as const),
    })
  );
};
