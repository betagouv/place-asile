import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

const prefixes = ["CADA", "HUDA", "CPH", "CAES", "PRAHDA"];

const generateCodeDna = () => {
  return `${faker.helpers.arrayElement(prefixes)}-${faker.string.numeric(6)}`;
};

test("Saisie du mot de passe", async ({ page }) => {
  const codeDna = generateCodeDna();

  await page.goto(
    `http://localhost:3000/ajout-structure/${codeDna}/01-identification`
  );

  await page.fill('input[type="password"]', "123456");
  await page.click("button.fr-btn");

  await page.waitForURL(
    `http://localhost:3000/ajout-structure/${codeDna}/01-identification`
  );

  // Case à cocher "filiale"
  await page.click("label[for='managed-by-a-filiale-input']");
  await expect(page.locator("input[name='filiale']")).toBeVisible();

  await page.fill("input[name='filiale']", faker.company.name());

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

  // Code FINESS (random string)
  await page.fill(
    'input[name="finessCode"]',
    faker.string.alphanumeric(8).toUpperCase()
  );

  // Public ciblé
  await page.selectOption("#public", "Tout public");

  // Checkboxes "labellisées"
  await page.click('input[name="lgbt"] + label');
  await page.click('input[name="fvvTeh"] + label');

  // Toggle CPOM (juste l’id, pas de name)
  // await page.click("#fr-toggle-_r_g_-input + label");

  // === Contact Principal ===

  await page.fill(
    'input[name="contactPrincipal.prenom"]',
    faker.person.firstName()
  );
  await page.fill(
    'input[name="contactPrincipal.nom"]',
    faker.person.lastName()
  );
  await page.fill('input[name="contactPrincipal.role"]', "Directeur·rice");
  await page.fill(
    'input[name="contactPrincipal.email"]',
    faker.internet.email()
  );
  await page.fill(
    'input[name="contactPrincipal.telephone"]',
    "+33 6" + faker.string.numeric(8).replace(/(.{2})(?=.)/g, "$1 ")
  );

  // === Contact Secondaire ===

  await page.fill(
    'input[name="contactSecondaire.prenom"]',
    faker.person.firstName()
  );
  await page.fill(
    'input[name="contactSecondaire.nom"]',
    faker.person.lastName()
  );
  await page.fill(
    'input[name="contactSecondaire.role"]',
    "Responsable administratif"
  );
  await page.fill(
    'input[name="contactSecondaire.email"]',
    faker.internet.email()
  );
  await page.fill(
    'input[name="contactSecondaire.telephone"]',
    "+33 7" + faker.string.numeric(8).replace(/(.{2})(?=.)/g, "$1 ")
  );

  // === Période d’autorisation ===

  await page.fill('input[name="debutPeriodeAutorisation"]', "2020-01-01");
  await page.fill('input[name="finPeriodeAutorisation"]', "2025-12-31");

  // === Convention en cours (optionnel) ===

  // await page.fill('input[name="debutConvention"]', "2021-01-01");
  // await page.fill('input[name="finConvention"]', "2024-12-31");

  // === Soumission ===

  await page.click('button[type="submit"]');

  await page.waitForURL(
    `http://localhost:3000/ajout-structure/${codeDna}/02-adresses`
  );

  // Wait 5 secs
  await page.waitForTimeout(5000);
});
