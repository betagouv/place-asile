import { Page } from "@playwright/test";

export class AuthenticationPage {
  constructor(private page: Page) {}

  async authenticate(dnaCode: string, firstStep: string = "01-identification") {
    await this.page.goto(
      `http://localhost:3000/ajout-structure/${dnaCode}/${firstStep}`,
      { waitUntil: "domcontentloaded" }
    );

    // Wait for password input to be visible
    await this.page.waitForSelector('input[type="password"]', {
      timeout: 10000,
    });

    await this.page.fill('input[type="password"]', process.env.PAGE_PASSWORD!);
    await this.page.click("button.fr-btn");

    // Wait for the page to load after authentication
    await this.page.waitForURL(
      `http://localhost:3000/ajout-structure/${dnaCode}/${firstStep}`,
      { timeout: 15000 }
    );
  }
}
