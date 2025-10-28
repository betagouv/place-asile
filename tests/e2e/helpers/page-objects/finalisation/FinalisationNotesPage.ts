import { Page } from "@playwright/test";

export class FinalisationNotesPage {
  constructor(private page: Page) {}

  async waitForLoad() {
    await this.page.waitForSelector('button[type="submit"]', {
      timeout: 10000,
    });
  }

  async fillNotes(notes: string) {
    await this.page.fill('textarea[name="notes"]', notes);
  }

  async submit() {
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(2000);
  }
}
