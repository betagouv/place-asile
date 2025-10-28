import { test } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";

import { completeFinalisationFlow } from "./helpers/complete-finalisation-flow";
import { deleteStructureViaApi } from "./helpers/structure-creator";
import { cadaSansCpom } from "./helpers/test-data";

test.setTimeout(120000);

test("Finalisation CADA sans CPOM - Flux complet", async ({ page }) => {
  const testData = {
    ...cadaSansCpom,
    dnaCode: `C${uuidv4()}`,
  };

  try {
    await completeFinalisationFlow(page, testData);
  } finally {
    try {
      await deleteStructureViaApi(testData.dnaCode);
    } catch (error) {
      console.warn(`Cleanup failed for structure ${testData.dnaCode}:`, error);
    }
  }
});
