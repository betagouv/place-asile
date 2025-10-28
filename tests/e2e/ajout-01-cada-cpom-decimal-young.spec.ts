import { test } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";

import { completeAjoutFlow } from "./helpers/complete-ajout-flow";
import { mockAddressApi } from "./helpers/mock-address-api";
import { deleteStructureViaApi } from "./helpers/structure-creator";
import { cadaCpomDecimalYoung } from "./helpers/test-data";

test.beforeEach(async ({ page }) => {
  await mockAddressApi(page);
});

test.setTimeout(30000);

test("1. CADA with CPOM, decimal budgets, young structure", async ({
  page,
}) => {
  const data = {
    ...cadaCpomDecimalYoung,
    dnaCode: `C${Date.now()}-${uuidv4()}`,
  };

  try {
    await completeAjoutFlow(page, data);
  } finally {
    try {
      await deleteStructureViaApi(data.dnaCode);
    } catch (error) {
      console.warn(`Cleanup failed for structure ${data.dnaCode}:`, error);
    }
  }
});
