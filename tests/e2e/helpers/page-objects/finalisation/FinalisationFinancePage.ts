import { Page } from "@playwright/test";

export class FinalisationFinancePage {
  constructor(private page: Page) {}

  async waitForLoad() {
    await this.page.waitForSelector('button[type="submit"]', {
      timeout: 10000,
    });
  }

  async fillMinimalData() {
    // Finance form has many required fields per year
    // Wait for the form to fully render
    await this.page.waitForTimeout(1000);

    // Fill required fields for each of the 5 years (2025, 2024, 2023, 2022, 2021)
    for (let i = 0; i < 5; i++) {
      // Basic indicators (required for all years)
      await this.page.fill(`input[name="budgets.${i}.ETP"]`, "10");
      await this.page.fill(`input[name="budgets.${i}.tauxEncadrement"]`, "0.5");
      await this.page.fill(`input[name="budgets.${i}.coutJournalier"]`, "50");

      // Year 2025 and 2024 (current/forecast years)
      if (i <= 1) {
        await this.page.fill(
          `input[name="budgets.${i}.dotationDemandee"]`,
          "100000"
        );
        await this.page.fill(
          `input[name="budgets.${i}.dotationAccordee"]`,
          "100000"
        );
      }

      // Years 2023, 2022, 2021 (historical years - more fields required)
      if (i >= 2) {
        await this.page.fill(
          `input[name="budgets.${i}.dotationDemandee"]`,
          "100000"
        );
        await this.page.fill(
          `input[name="budgets.${i}.dotationAccordee"]`,
          "100000"
        );
        await this.page.fill(
          `input[name="budgets.${i}.totalProduits"]`,
          "100000"
        );
        await this.page.fill(
          `input[name="budgets.${i}.totalChargesProposees"]`,
          "95000"
        );
        await this.page.fill(
          `input[name="budgets.${i}.totalCharges"]`,
          "95000"
        );
        await this.page.fill(`input[name="budgets.${i}.repriseEtat"]`, "0");
        await this.page.fill(
          `input[name="budgets.${i}.affectationReservesFondsDedies"]`,
          "0"
        );
      }
    }

    console.log("✅ Filled finance form with minimal test data");
  }

  async submit(structureId: number) {
    // Click submit button
    await this.page.click('button[type="submit"]');

    // Check if we're still on the same page (validation error) or moved forward
    await this.page.waitForTimeout(2000);

    const currentUrl = this.page.url();

    if (currentUrl.includes("/03-finance")) {
      console.warn("⚠️  Still on finance page - may have validation errors");
      // Log any visible error messages
      const errorMessages = await this.page
        .locator('.fr-error-text, [class*="error"]')
        .allTextContents();
      if (errorMessages.length > 0) {
        console.warn("Validation errors:", errorMessages);
      }
    }

    // Wait for navigation (more lenient timeout)
    try {
      await this.page.waitForURL(
        `http://localhost:3000/structures/${structureId}/finalisation/04-type-places`,
        { timeout: 15000 }
      );
    } catch (error) {
      console.error(
        `Failed to navigate to step 4. Current URL: ${this.page.url()}`
      );
      throw error;
    }
  }
}
