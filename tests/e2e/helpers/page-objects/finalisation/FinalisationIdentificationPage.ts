import { Page } from "@playwright/test";

export class FinalisationIdentificationPage {
  constructor(private page: Page) {}

  async waitForLoad() {
    // Wait for the form to load
    await this.page.waitForSelector('button[type="submit"]', {
      timeout: 10000,
    });
  }

  async submit() {
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(2000);
  }

  async waitForValidation() {
    await this.page.waitForSelector('text="VÉRIFIÉ"', {
      timeout: 10000,
    });
  }
}
