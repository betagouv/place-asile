import { expect, Page } from "@playwright/test";

export class FinalisationNotesPage {
  constructor(private page: Page) {}

  async waitForLoad() {
    await this.page.waitForSelector('button[type="submit"]', {
      timeout: 10000,
    });
  }

  async fillNotes(notes: string = "Notes de test pour la finalisation") {
    await this.page.fill('textarea[name="notes"]', notes);
  }

  async submit(structureId: number) {
    await this.page.click('button[type="submit"]');

    // After submitting the last step, should redirect to structure page
    await this.page.waitForURL(
      `http://localhost:3000/structures/${structureId}`,
      { timeout: 15000 }
    );
  }

  async verifySuccess() {
    // Verify we're redirected back to the structure page after finalisation
    // The URL should be /structures/[id] without /finalisation
    await this.page.waitForURL(/\/structures\/\d+$/, { timeout: 10000 });
  }
}
