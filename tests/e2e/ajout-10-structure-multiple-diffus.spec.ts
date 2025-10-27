import { test } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";

import { completeAjoutFlow } from "./helpers/complete-ajout-flow";
import { mockAddressApi } from "./helpers/mock-address-api";
import { deleteStructureViaApi } from "./helpers/structure-creator";
import { structureMultipleDiffus } from "./helpers/test-data";

// Mock the address API to avoid rate limiting
test.beforeEach(async ({ page }) => {
  await mockAddressApi(page);
});

// Increase timeout for full form flow
test.setTimeout(30000);

test("10. Structure with multiple diffus addresses and varying typologies", async ({
  page,
}) => {
  const data = {
    ...structureMultipleDiffus,
    dnaCode: `R${uuidv4()}`,
  };

  try {
    // Complete the entire ajout flow through the UI
    await completeAjoutFlow(page, data);
  } finally {
    // Cleanup: Delete the created structure
    try {
      await deleteStructureViaApi(data.dnaCode);
    } catch (error) {
      console.warn(`Cleanup failed for structure ${data.dnaCode}:`, error);
    }
  }
});
