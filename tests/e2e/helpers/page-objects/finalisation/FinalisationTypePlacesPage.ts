import { Page } from "@playwright/test";

export type FinalisationTypePlacesData = {
  placesACreer: number;
  placesAFermer: number;
  echeancePlacesACreer?: string;
  echeancePlacesAFermer?: string;
};

export class FinalisationTypePlacesPage {
  constructor(private page: Page) {}

  async waitForLoad() {
    await this.page.waitForSelector('button[type="submit"]', {
      timeout: 10000,
    });
  }

  async fillPlacesData(data: FinalisationTypePlacesData) {
    await this.page.fill(
      'input[name="placesACreer"]',
      data.placesACreer.toString()
    );
    await this.page.fill(
      'input[name="placesAFermer"]',
      data.placesAFermer.toString()
    );

    // Fill optional date fields if places are being created/closed
    if (data.placesACreer > 0 && data.echeancePlacesACreer) {
      await this.page.fill(
        'input[name="echeancePlacesACreer"]',
        data.echeancePlacesACreer
      );
    }
    if (data.placesAFermer > 0 && data.echeancePlacesAFermer) {
      await this.page.fill(
        'input[name="echeancePlacesAFermer"]',
        data.echeancePlacesAFermer
      );
    }
  }

  async submit(structureId: number) {
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL(
      `http://${process.env.NEXT_PUBLIC_BASE_URL}/structures/${structureId}/finalisation/05-qualite`,
      { timeout: 10000 }
    );
  }
}
