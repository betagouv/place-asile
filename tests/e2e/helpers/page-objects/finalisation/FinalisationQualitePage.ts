import { Page } from "@playwright/test";

export class FinalisationQualitePage {
  constructor(private page: Page) {}

  async waitForLoad() {
    await this.page.waitForSelector('button[type="submit"]', {
      timeout: 10000,
    });
  }

  async submit(structureId: number) {
    // Quality page has file uploads which are optional
    // Scroll to submit button to ensure it's in view
    const submitButton = this.page.locator('button[type="submit"]');
    await submitButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);

    // Set up promise to wait for navigation
    const navigationPromise = this.page.waitForURL(
      `http://localhost:3000/structures/${structureId}/finalisation/06-notes`,
      { timeout: 20000 }
    );

    // Click the submit button and wait for navigation
    await submitButton.click();

    try {
      await navigationPromise;
    } catch (error) {
      console.error(
        `Failed to navigate to step 6. Current URL: ${this.page.url()}`
      );

      // Check for any errors on the page
      const errorMessages = await this.page
        .locator('.fr-error-text, [class*="error"]')
        .allTextContents();
      if (errorMessages.length > 0) {
        console.warn("Validation errors:", errorMessages);
      }

      // Try clicking the button again with force
      console.warn("⚠️  Retrying submit...");
      await submitButton.click({ force: true });
      await this.page.waitForURL(
        `http://localhost:3000/structures/${structureId}/finalisation/06-notes`,
        { timeout: 10000 }
      );
    }
  }
}
