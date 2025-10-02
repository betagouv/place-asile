import { expect, test } from "@playwright/test";

test("Première étape CADA sans CPOM", async ({ page }) => {
  const codeDna = "C1234";

  await page.goto(
    `http://localhost:3000/ajout-structure/${codeDna}/01-identification`
  );

  await page.fill('input[type="password"]', process.env.PAGE_PASSWORD!);
  await page.click("button.fr-btn");

  await page.waitForURL(
    `http://localhost:3000/ajout-structure/${codeDna}/01-identification`
  );

  // Case à cocher "filiale"
  await page.click("label[for='managed-by-a-filiale-input']");
  await expect(page.locator("input[name='filiale']")).toBeVisible();

  await page.fill("input[name='filiale']", "Filiale");

  // Opérateur (champ texte)
  await page.click('input[name="operateur.name"]');
  await page.fill('input[name="operateur.name"]', `Opér`);

  await page.waitForSelector("#suggestion-0", {
    state: "visible",
    timeout: 5000,
  });

  await page.click("#suggestion-0");

  // Date de création
  await page.fill('input[name="creationDate"]', "2015-06-01");

  // Code FINESS
  await page.fill('input[name="finessCode"]', "123456789");

  // Public ciblé
  await page.selectOption("#public", "Tout public");

  // Checkboxes "labellisées"
  await page.click('input[name="lgbt"] + label');
  await page.click('input[name="fvvTeh"] + label');

  // Contact Principal

  await page.fill('input[name="contactPrincipal.prenom"]', "John");
  await page.fill('input[name="contactPrincipal.nom"]', "Doe");
  await page.fill('input[name="contactPrincipal.role"]', "Directeur·rice");
  await page.fill(
    'input[name="contactPrincipal.email"]',
    "john.doe@example.com"
  );
  await page.fill('input[name="contactPrincipal.telephone"]', "+33123456789");

  // Contact Secondaire

  await page.fill('input[name="contactSecondaire.prenom"]', "Jane");
  await page.fill('input[name="contactSecondaire.nom"]', "Deo");
  await page.fill(
    'input[name="contactSecondaire.role"]',
    "Responsable administratif"
  );
  await page.fill(
    'input[name="contactSecondaire.email"]',
    "jane.deo@example.com"
  );
  await page.fill('input[name="contactSecondaire.telephone"]', "+33623456789");

  // Période d’autorisation

  await page.fill('input[name="debutPeriodeAutorisation"]', "2020-01-01");
  await page.fill('input[name="finPeriodeAutorisation"]', "2025-12-31");

  // Soumission

  await page.click('button[type="submit"]');

  await page.waitForURL(
    `http://localhost:3000/ajout-structure/${codeDna}/02-adresses`
  );
});
