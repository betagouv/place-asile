import { test } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";

import { completeFinalisationFlow } from "./helpers/complete-finalisation-flow";
import { deleteStructureViaApi } from "./helpers/structure-creator";
import { caesAvecCpom } from "./helpers/test-data";

// Increase timeout for full finalisation flow
test.setTimeout(120000);

test("Finalisation CAES avec CPOM - Flux complet", async ({ page }) => {
  const testData = {
    ...caesAvecCpom,
    dnaCode: `K${uuidv4()}`,
  };

  try {
    // Complete the entire finalisation flow through the UI
    await completeFinalisationFlow(page, testData);
  } finally {
    // Cleanup: Delete the created structure
    try {
      await deleteStructureViaApi(testData.dnaCode);
    } catch (error) {
      console.warn(`Cleanup failed for structure ${testData.dnaCode}:`, error);
    }
  }
});
