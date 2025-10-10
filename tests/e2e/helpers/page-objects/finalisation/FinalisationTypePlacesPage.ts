import { Page } from "@playwright/test";

export class FinalisationTypePlacesPage {
  constructor(private page: Page) {}

  async waitForLoad() {
    await this.page.waitForSelector('button[type="submit"]', {
      timeout: 10000,
    });
  }

  async fillPlacesData() {
    // Fill placesACreer and placesAFermer with 0 to skip optional date fields
    await this.page.fill('input[name="placesACreer"]', "0");
    await this.page.fill('input[name="placesAFermer"]', "0");
  }

  async submit(structureId: number) {
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL(
      `http://localhost:3000/structures/${structureId}/finalisation/05-qualite`,
      { timeout: 10000 }
    );
  }
}
