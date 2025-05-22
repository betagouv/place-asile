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
  const uploadFile = async (file: File): Promise<FileUploadWithLink> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/files", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Envoi du fichier échoué");
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

  const getDownloadLink = async (key: string): Promise<string> => {
    const encodedKey = encodeURIComponent(key);
    const response = await fetch(`/api/files/${encodedKey}?getLink=true`);
    const result = await response.json();
    return result.url;
  };

  const deleteFile = async (key: string): Promise<void> => {
    const encodedKey = encodeURIComponent(key);
    const response = await fetch(`/api/files/${encodedKey}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de la suppression");
    }

    return await response.json();
  };

  return { uploadFile, getFile, deleteFile, getDownloadLink };
};
