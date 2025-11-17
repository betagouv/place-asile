import { StructureApiType } from "@/schemas/api/structure.schema";

import { transformTestDataToApiFormat } from "./api-data-transformer";
import { TestStructureData } from "./test-data";

/**
 * Creates a structure via the API endpoint
 * Returns the structure's dnaCode for use in tests
 */
export async function createStructureViaApi(
  testData: TestStructureData
): Promise<string> {
  const apiData = transformTestDataToApiFormat(testData);

  const response = await fetch("http://localhost:3000/api/structures", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(apiData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Failed to create structure via API: ${JSON.stringify(error)}`
    );
  }

  // Structure is created with state A_FINALISER by default
  return testData.dnaCode;
}

/**
 * Deletes a structure via the API endpoint (for cleanup)
 */
export async function deleteStructureViaApi(dnaCode: string): Promise<void> {
  const response = await fetch(
    `http://localhost:3000/api/structures?dnaCode=${dnaCode}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    console.warn(
      `Failed to delete structure ${dnaCode}:`,
      await response.text()
    );
  }
}

/**
 * Gets a structure's ID from its DNA code
 */
export async function getStructureId(dnaCode: string): Promise<number> {
  const response = await fetch("http://localhost:3000/api/structures");

  if (!response.ok) {
    throw new Error("Failed to fetch structures");
  }

  const structures = await response.json();
  const structure = structures.find(
    (s: StructureApiType) => s.codesDna.some((codeDna) => codeDna.code === dnaCode)
  );

  if (!structure) {
    throw new Error(`Structure with dnaCode ${dnaCode} not found`);
  }

  return structure.id;
}
