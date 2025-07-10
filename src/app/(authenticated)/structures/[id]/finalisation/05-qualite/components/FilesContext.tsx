import React, { createContext, useContext, useState } from "react";

export type UploadsByCategoryFileData = {
  date?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  key: string;
  category?: string;
  id?: string;
  avenants?: UploadsByCategoryFileData[];
};

export enum FileMetaData {
  DATE_TYPE,
  DATE_START_END,
  NAME,
}

type FilesContextType = {
  files: UploadsByCategoryFileData[];
  addFile: () => void;
  deleteFile: (fileIndex: number) => void;
  addAvenant: (fileIndex: number) => void;
  deleteAvenant: (fileIndex: number, avenantId: string) => void;
};

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export const FilesProvider: React.FC<{
  initialFiles: UploadsByCategoryFileData[];
  children: React.ReactNode;
}> = ({ initialFiles, children }) => {
  const generateId = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const ensureIds = (
    items: UploadsByCategoryFileData[]
  ): UploadsByCategoryFileData[] => {
    return items.map((item) => {
      const itemWithId = { ...item, id: item.id || generateId() };

      if (itemWithId.avenants && itemWithId.avenants.length > 0) {
        itemWithId.avenants = ensureIds(itemWithId.avenants);
      }

      return itemWithId;
    });
  };

  const initialFilesWithIds = ensureIds(initialFiles || []);
  const [files, setFiles] = useState(initialFilesWithIds);

  const addFile = () => {
    setFiles([...files, { date: "", type: "", key: "", id: generateId() }]);
  };

  const deleteFile = (fileIndex: number) => {
    const newFiles = [...files];
    newFiles.splice(fileIndex, 1);
    setFiles(newFiles);
  };

  const addAvenant = (fileIndex: number) => {
    const newFiles = JSON.parse(JSON.stringify(files));

    if (!newFiles[fileIndex]) {
      console.error("Invalid file index:", fileIndex);
      return;
    }

    if (!newFiles[fileIndex].avenants) {
      newFiles[fileIndex].avenants = [];
    }

    newFiles[fileIndex].avenants = [
      ...newFiles[fileIndex].avenants,
      { date: "", key: "", id: generateId() },
    ];

    setFiles(newFiles);
  };

  const deleteAvenant = (fileIndex: number, avenantId: string) => {
    const newFiles = JSON.parse(JSON.stringify(files));

    const parentFile = newFiles[fileIndex];

    const avenantIndex = parentFile.avenants.findIndex(
      (avenant: UploadsByCategoryFileData) => avenant.id === avenantId
    );

    if (avenantIndex === -1) {
      const numericId = parseInt(avenantId);
      if (
        !isNaN(numericId) &&
        numericId >= 0 &&
        numericId < parentFile.avenants.length
      ) {
        parentFile.avenants.splice(numericId, 1);
        setFiles(newFiles);
        return;
      }
      return;
    }

    parentFile.avenants.splice(avenantIndex, 1);

    setFiles(newFiles);
  };

  return (
    <FilesContext.Provider
      value={{ files, addFile, deleteFile, addAvenant, deleteAvenant }}
    >
      {children}
    </FilesContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw new Error("useFiles must be used within a FilesProvider");
  }
  return context;
};
