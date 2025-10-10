import { test, expect } from "@playwright/test";

import { CADA_SANS_CPOM_DATA } from "./helpers/test-data";
import {
  createStructureViaApi,
  deleteStructureViaApi,
  getStructureId,
} from "./helpers/structure-creator";

// Increase timeout for API operations
test.setTimeout(30000);

test.describe("Structure Creation via API", () => {
  test("Should create a CADA structure via API", async () => {
    // Generate unique DNA code
    const timestamp = Date.now().toString().slice(-6);
    const testData = {
      ...CADA_SANS_CPOM_DATA,
      dnaCode: `C${timestamp}`,
    };

    try {
      // Create structure via API
      const dnaCode = await createStructureViaApi(testData);
      expect(dnaCode).toBe(testData.dnaCode);

      // Verify structure was created by fetching its ID
      const structureId = await getStructureId(dnaCode);
      expect(structureId).toBeGreaterThan(0);

      console.log(
        `✅ Structure created successfully: ${dnaCode} (ID: ${structureId})`
      );
    } finally {
      // Cleanup: delete the test structure
      await deleteStructureViaApi(testData.dnaCode);
    }
  });
});
