import { v4 as uuidv4 } from "uuid";

export type MockFileUpload = {
  key: string;
  category: string;
  date: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
};

/**
 * Generate mock file upload data for testing
 */
export function generateMockFileUpload(
  category: string,
  year: string,
  options?: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  }
): MockFileUpload {
  const fileName =
    options?.fileName || `test-${category.toLowerCase()}-${year}.pdf`;
  const fileSize = options?.fileSize || 1024 * 1024; // 1MB default
  const mimeType = options?.mimeType || "application/pdf";

  return {
    key: uuidv4(),
    category,
    date: `${year}-01-01`,
    fileName,
    fileSize,
    mimeType,
  };
}

/**
 * Generate multiple mock file uploads for a structure
 */
export function generateMockFileUploads(
  structureType: "CADA" | "CPH" | "HUDA" | "CAES",
  years: string[],
  options?: {
    includeOptional?: boolean;
    maxFileSize?: number;
    differentFormats?: boolean;
  }
): MockFileUpload[] {
  const uploads: MockFileUpload[] = [];
  const includeOptional = options?.includeOptional ?? true;
  const maxFileSize = options?.maxFileSize ?? 10 * 1024 * 1024; // 10MB
  const differentFormats = options?.differentFormats ?? true;

  // Define required documents per structure type
  const requiredDocuments = getRequiredDocuments(structureType);
  const optionalDocuments = getOptionalDocuments(structureType);

  years.forEach((year) => {
    // Add required documents
    requiredDocuments.forEach((doc) => {
      const mimeType = differentFormats ? getMimeType(0) : "application/pdf";
      const fileSize = Math.floor(Math.random() * maxFileSize) + 1024; // Random size between 1KB and maxFileSize

      uploads.push(
        generateMockFileUpload(doc.category, year, {
          fileName: `${doc.label.toLowerCase().replace(/\s+/g, "-")}-${year}.${getFileExtension(mimeType)}`,
          fileSize,
          mimeType,
        })
      );
    });

    // Add optional documents if requested
    if (includeOptional) {
      optionalDocuments.forEach((doc, index) => {
        // 50% chance to include optional document
        if (index % 2 === 0) {
          const mimeType = differentFormats
            ? getMimeType(Math.floor(index / 2))
            : "application/pdf";
          const fileSize = Math.floor(Math.random() * maxFileSize) + 1024;

          uploads.push(
            generateMockFileUpload(doc.category, year, {
              fileName: `${doc.label.toLowerCase().replace(/\s+/g, "-")}-${year}.${getFileExtension(mimeType)}`,
              fileSize,
              mimeType,
            })
          );
        }
      });
    }
  });

  return uploads;
}

/**
 * Get required documents for each structure type
 */
function getRequiredDocuments(structureType: string) {
  const baseDocuments = [
    {
      label: "Budget prévisionnel demandé",
      category: "BUDGET_PREVISIONNEL_DEMANDE",
    },
    {
      label: "Compte administratif soumis",
      category: "COMPTE_ADMINISTRATIF_SOUMIS",
    },
  ];

  if (structureType === "CADA" || structureType === "CPH") {
    return [
      ...baseDocuments,
      {
        label: "Budget prévisionnel retenu",
        category: "BUDGET_PREVISIONNEL_RETENU",
      },
      {
        label: "Compte administratif retenu",
        category: "COMPTE_ADMINISTRATIF_RETENU",
      },
    ];
  }

  if (structureType === "HUDA" || structureType === "CAES") {
    return [
      ...baseDocuments,
      { label: "Demande de subvention", category: "DEMANDE_SUBVENTION" },
      { label: "Compte rendu financier", category: "COMPTE_RENDU_FINANCIER" },
    ];
  }

  return baseDocuments;
}

/**
 * Get optional documents for each structure type
 */
function getOptionalDocuments(structureType: string) {
  const baseOptional = [
    { label: "Rapport budgétaire", category: "RAPPORT_BUDGETAIRE" },
    { label: "Rapport d'activité", category: "RAPPORT_ACTIVITE" },
  ];

  if (structureType === "CADA" || structureType === "CPH") {
    return [
      ...baseOptional,
      { label: "Budget rectificatif", category: "BUDGET_RECTIFICATIF" },
    ];
  }

  if (structureType === "HUDA" || structureType === "CAES") {
    return [
      ...baseOptional,
      {
        label: "Rapport d'activité opérateur",
        category: "RAPPORT_ACTIVITE_OPERATEUR",
      },
    ];
  }

  return baseOptional;
}

/**
 * Get MIME type for testing different file formats
 */
function getMimeType(index: number): string {
  const mimeTypes = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "application/vnd.oasis.opendocument.spreadsheet",
  ];
  return mimeTypes[index < mimeTypes.length ? index : mimeTypes.length - 1];
}

/**
 * Get file extension from MIME type
 */
function getFileExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    "application/pdf": "pdf",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "text/csv": "csv",
    "application/vnd.oasis.opendocument.spreadsheet": "ods",
  };
  return extensions[mimeType] || "pdf";
}

/**
 * Generate mock file upload that exceeds size limit (for validation testing)
 */
export function generateOversizedMockFileUpload(
  category: string,
  year: string
): MockFileUpload {
  return generateMockFileUpload(category, year, {
    fileName: `oversized-${category.toLowerCase()}-${year}.pdf`,
    fileSize: 15 * 1024 * 1024, // 15MB - exceeds 10MB limit
    mimeType: "application/pdf",
  });
}

/**
 * Generate mock file upload with invalid format (for validation testing)
 */
export function generateInvalidFormatMockFileUpload(
  category: string,
  year: string
): MockFileUpload {
  return generateMockFileUpload(category, year, {
    fileName: `invalid-${category.toLowerCase()}-${year}.txt`,
    fileSize: 1024,
    mimeType: "text/plain", // Not allowed format
  });
}
