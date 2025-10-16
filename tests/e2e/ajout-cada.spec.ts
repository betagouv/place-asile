import { test } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";

import { completeAjoutFlow } from "./helpers/complete-ajout-flow";
import { mockAddressApi } from "./helpers/mock-address-api";
import { StructureDetailPage } from "./helpers/page-objects/StructureDetailPage";
import {
  deleteStructureViaApi,
  getStructureId,
} from "./helpers/structure-creator";
import { cadaSansCpom } from "./helpers/test-data";

// Mock the address API to avoid rate limiting
test.beforeEach(async ({ page }) => {
  await mockAddressApi(page);
});

// Increase timeout for full form flow
test.setTimeout(30000);

test("CADA sans CPOM - Flux complet de création", async ({ page }) => {
  const data = {
    ...cadaSansCpom,
    dnaCode: `C${uuidv4()}`,
  };

  try {
    // Complete the entire ajout flow through the UI
    await completeAjoutFlow(page, data);

    // Navigate to structure detail page and verify data
    const structureId = await getStructureId(data.dnaCode);
    const structureDetailPage = new StructureDetailPage(page);
    await structureDetailPage.navigateToStructure(structureId);
    await structureDetailPage.verifyStructureData(data);
  } finally {
    // Cleanup: Delete the created structure
    try {
      await deleteStructureViaApi(data.dnaCode);
    } catch (error) {
      console.warn(`Cleanup failed for structure ${data.dnaCode}:`, error);
    }
  }
});
