import { StructureDocument } from "@/app/components/forms/finance/documents/documentsStructures";

export const getDocumentIndexes = (
  years: string[],
  documents: StructureDocument[]
) => {
  const indexes: Record<string, number> = {};
  let counter = 0;

  years.forEach((year) => {
    documents.forEach((document) => {
      const todayYear = new Date().getFullYear();
      if (Number(year) <= todayYear - document.yearIndex) {
        const key = `${document.value}-${year}`;
        indexes[key] = counter++;
      }
    });
  });

  return indexes;
};
