import { Page } from "@playwright/test";

export class FinalisationAdressesPage {
  constructor(private page: Page) {}

  async waitForLoad() {
    await this.page.waitForSelector('button[type="submit"]', {
      timeout: 10000,
    });
  }

  async submit(structureId: number) {
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL(
      `http://${process.env.NEXT_PUBLIC_BASE_URL}/structures/${structureId}/finalisation/03-finance`,
      { timeout: 10000 }
    );
  }
}
