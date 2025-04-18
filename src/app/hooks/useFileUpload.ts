export const useFileUpload = () => {
  const uploadFile = async (
    file: File,
    date: Date,
    category: string
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("date", date.toString());
    formData.append("category", category);
    const response = await fetch("/api/files", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    return result.message;
  };

  const getDownloadLink = async (fileName: string): Promise<string> => {
    const response = await fetch(`/api/files?fileName=${fileName}`);
    const result = await response.json();
    return result.data;
  };

  return { uploadFile, getDownloadLink };
};
