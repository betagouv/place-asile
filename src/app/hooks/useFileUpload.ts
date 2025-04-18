export const useFileUpload = () => {
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/files", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    return result.message;
  };

  return { uploadFile };
};
