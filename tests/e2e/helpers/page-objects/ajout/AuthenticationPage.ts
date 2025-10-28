import { Page } from "@playwright/test";

export class AuthenticationPage {
  constructor(private page: Page) {}

  async authenticate(dnaCode: string) {
    await this.page.goto(`${process.env.NEXT_URL}/ajout-structure/${dnaCode}`, {
      waitUntil: "domcontentloaded",
    });

    // Check if auth is bypassed (DEV_AUTH_BYPASS=1)
    const passwordInput = await this.page
      .locator('input[type="password"]')
      .count();

    if (passwordInput > 0) {
      // Password protection is active - authenticate
      await this.page.fill(
        'input[type="password"]',
        process.env.PAGE_PASSWORD!
      );
      await this.page.click("button.fr-btn");

      // Wait for the page to load after authentication
      await this.page.waitForURL(
        `${process.env.NEXT_URL}/ajout-structure/${dnaCode}`,
        { timeout: 15000 }
      );
    } else {
      // Auth is bypassed - just wait for the form to load
      await this.page.waitForTimeout(1000);
    }
  }
}
