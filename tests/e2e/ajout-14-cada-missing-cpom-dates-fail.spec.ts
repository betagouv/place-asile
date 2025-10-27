import { expect, test } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";

import { mockAddressApi } from "./helpers/mock-address-api";
import { AuthenticationPage } from "./helpers/page-objects/ajout/AuthenticationPage";
import { IdentificationPage } from "./helpers/page-objects/ajout/IdentificationPage";
import { PresentationPage } from "./helpers/page-objects/ajout/PresentationPage";
import { deleteStructureViaApi } from "./helpers/structure-creator";
import { cadaMissingCpomDates } from "./helpers/test-data";

// Mock the address API to avoid rate limiting
test.beforeEach(async ({ page }) => {
  await mockAddressApi(page);
});

// Increase timeout for full form flow
test.setTimeout(30000);

test("14. CADA missing required CPOM dates should fail", async ({ page }) => {
  const data = {
    ...cadaMissingCpomDates,
    dnaCode: `C${uuidv4()}`,
  };

  try {
    // Étape 0: Authentification
    const authPage = new AuthenticationPage(page);
    await authPage.authenticate(data.dnaCode);

    // Étape 0.5: Page de présentation
    const presentationPage = new PresentationPage(page);
    await presentationPage.navigateToFirstStep(data.dnaCode);

    // Étape 1: Identification - should fail or show validation errors
    const identificationPage = new IdentificationPage(page);
    await identificationPage.fillForm(data);

    // Try to submit - should not navigate to next page due to validation error
    await page.click('button[type="submit"]');

    // Wait a bit for validation errors to appear
    await page.waitForTimeout(1000);

    // Check that we're still on the identification page (validation failed)
    await expect(page).toHaveURL(
      new RegExp(`/ajout-structure/${data.dnaCode}/01-identification`)
    );

    // Check that there's a validation error message visible
    const errorMessage = page.locator(
      '[class*="error"], [class*="fr-error-text"]'
    );
    await expect(errorMessage.first()).toBeVisible();
  } finally {
    // Cleanup: Try to delete the structure if it was somehow created
    try {
      await deleteStructureViaApi(data.dnaCode, true);
    } catch {
      // Expected to fail since structure shouldn't be created
    }
  }
});
