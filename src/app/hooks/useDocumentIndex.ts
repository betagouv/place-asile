import { StructureDocument } from "../(password-protected)/ajout-structure/[dnaCode]/04-documents/documents";

export const useDocumentIndex = () => {
  const getDocumentIndexes = (
    years: string[],
    documents: StructureDocument[]
  ) => {
    const indexes: Record<string, number> = {};
    let counter = 0;

    years.forEach((year) => {
      const currentYear = new Date().getFullYear().toString();

      documents.forEach((document) => {
        if (
          (currentYear === "2025" && document.currentYear) ||
          year !== currentYear
        ) {
          const key = `${document.value}-${year}`;
          indexes[key] = counter++;
        }
      });
    });

    return indexes;
  };

  return { getDocumentIndexes };
};
