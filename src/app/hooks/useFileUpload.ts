export type FileUploadResponse = {
  key: string;
  mimeType: string;
  originalName: string;
  id: number;
  fileSize: number;
};

export type FileUploadWithLink = FileUploadResponse & {
  fileUrl: string;
};

export const useFileUpload = () => {
  const uploadFile = async (
    file: File,
    date: Date,
    category: string
  ): Promise<FileUploadWithLink> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("date", date.toString());
    formData.append("category", category);
    const response = await fetch("/api/files", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }
    const result = await response.json();
    return {
      ...result,
      fileUrl: await getDownloadLink(result.key),
    };
  };

  const getFile = async (key: string): Promise<FileUploadWithLink> => {
    const encodedKey = encodeURIComponent(key);
    const response = await fetch(`/api/files/${encodedKey}`);
    const result = await response.json();
    return {
      ...result,
      fileUrl: await getDownloadLink(result.key),
    };
  };

  const getDownloadLink = async (fileName: string): Promise<string> => {
    const response = await fetch(`/api/files?fileName=${fileName}`);
    const result = await response.json();
    return result.url;
  };

  const deleteFile = async (key: string): Promise<void> => {
    const encodedKey = encodeURIComponent(key);
    const response = await fetch(`/api/files/${encodedKey}/delete`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Delete failed");
    }

    return await response.json();
  };

  return { uploadFile, getFile, deleteFile, getDownloadLink };
};
