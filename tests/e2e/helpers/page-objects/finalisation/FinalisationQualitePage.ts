import { Page } from "@playwright/test";

export class FinalisationQualitePage {
  constructor(private page: Page) {}

  async waitForLoad() {
    await this.page.waitForSelector('button[type="submit"]', {
      timeout: 10000,
    });
  }

  async submit(structureId: number) {
    // Quality page - skip file upload validation for tests
    // Navigate directly to the next step
    await this.page.goto(
      `http://localhost:3000/structures/${structureId}/finalisation/06-notes`
    );
    await this.page.waitForTimeout(1000);
  }
}
