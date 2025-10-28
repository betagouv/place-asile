import { expect, Page } from "@playwright/test";

import { TestStructureData } from "../../test-data";

export class VerificationPage {
  constructor(private page: Page) {}

  async verifyData(data: TestStructureData) {
    // Wait for the verification page to load
    await this.page.waitForTimeout(1000);

    // Verify we're on the verification page by checking for the main heading
    await expect(
      this.page.getByRole("heading", { name: /Vérification des données/i })
    ).toBeVisible({ timeout: 10000 });

    // Basic verification - just check that some key data is present
    // The email should be visible somewhere on the page
    if (data.identification.contactPrincipal) {
      await expect(
        this.page.locator(`text=${data.identification.contactPrincipal.email}`)
      ).toBeVisible({ timeout: 5000 });
    }

    // Wait a bit more to ensure all data is loaded
    await this.page.waitForTimeout(1000);
  }

  async submit(dnaCode: string) {
    // Wait for button to be enabled (not disabled)
    const submitButton = this.page.getByRole("button", { name: /Valider/i });
    await submitButton.waitFor({ state: "visible", timeout: 10000 });

    // Check if button is disabled
    const isDisabled = await submitButton.isDisabled();
    if (isDisabled) {
      // Wait a bit more for the button to become enabled
      await this.page.waitForTimeout(2000);
    }

    await submitButton.click();

    // Wait for navigation to confirmation page
    await this.page.waitForURL(
      `${process.env.NEXT_URL}/ajout-structure/${dnaCode}/06-confirmation`,
      { timeout: 20000 }
    );
  }
}
