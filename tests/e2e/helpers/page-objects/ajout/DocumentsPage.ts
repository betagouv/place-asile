import { Page } from "@playwright/test";

import { TestStructureData } from "../../test-data";

export class DocumentsPage {
  constructor(private page: Page) {}

  async fillForm(data: TestStructureData) {
    const { documents } = data;

    // Check "less than 5 years" checkbox if needed
    if (documents.less5Years) {
      const checkbox = this.page.locator('input[name="less5Years"]');
      const isChecked = await checkbox.isChecked();
      if (!isChecked) {
        await this.page.click('input[name="less5Years"] + label');
      }
    }

    // For now, we'll skip file uploads since they're complex
    // In a real test, you would upload files using page.setInputFiles()
  }

  async submit(dnaCode: string) {
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL(
      `${process.env.NEXT_PUBLIC_BASE_URL}/ajout-structure/${dnaCode}/05-verification`,
      { timeout: 10000 }
    );
  }
}
