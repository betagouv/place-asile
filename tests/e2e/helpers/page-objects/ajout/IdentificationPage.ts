import { expect, Page } from "@playwright/test";

import { TestStructureData } from "../../test-data";

export class IdentificationPage {
  constructor(private page: Page) {}

  async fillForm(data: TestStructureData) {
    const { identification } = data;

    // Filiale (if provided)
    if (identification.filiale) {
      await this.page.click("label[for='managed-by-a-filiale-input']");
      await expect(this.page.locator("input[name='filiale']")).toBeVisible();
      await this.page.fill("input[name='filiale']", identification.filiale);
    }

    // Opérateur (autocomplete)
    await this.page.click('input[name="operateur.name"]');
    await this.page.fill(
      'input[name="operateur.name"]',
      identification.operateur.searchTerm
    );
    await this.page.waitForSelector("#suggestion-0", {
      state: "visible",
      timeout: 5000,
    });
    await this.page.click("#suggestion-0");

    // Date de création
    const simpleDate = identification.creationDate.split("T")[0]; // Convert ISO to YYYY-MM-DD
    await this.page.fill('input[name="creationDate"]', simpleDate);

    // Code FINESS (if required for autorisée structures)
    if (identification.finessCode) {
      await this.page.fill(
        'input[name="finessCode"]',
        identification.finessCode
      );
    }

    // Public ciblé
    await this.page.selectOption("#public", identification.public);

    // Checkboxes labellisées
    if (identification.lgbt) {
      await this.page.click('input[name="lgbt"] + label');
    }
    if (identification.fvvTeh) {
      await this.page.click('input[name="fvvTeh"] + label');
    }

    // CPOM toggle switch and dates
    if (data.cpom) {
      // Click the CPOM toggle switch
      await this.page.click('input[title="CPOM"]');

      // Wait for CPOM date fields to appear
      await this.page.waitForTimeout(300);

      if (identification.debutCpom) {
        const debutCpomDate = identification.debutCpom.split("T")[0]; // Convert ISO to YYYY-MM-DD
        await this.page.fill('input[name="debutCpom"]', debutCpomDate);
      }
      if (identification.finCpom) {
        const finCpomDate = identification.finCpom.split("T")[0]; // Convert ISO to YYYY-MM-DD
        await this.page.fill('input[name="finCpom"]', finCpomDate);
      }
    }

    // Contact Principal
    if (identification.contactPrincipal) {
      await this.page.fill(
        'input[name="contactPrincipal.prenom"]',
        identification.contactPrincipal.prenom
      );
      await this.page.fill(
        'input[name="contactPrincipal.nom"]',
        identification.contactPrincipal.nom
      );
      await this.page.fill(
        'input[name="contactPrincipal.role"]',
        identification.contactPrincipal.role
      );
      await this.page.fill(
        'input[name="contactPrincipal.email"]',
        identification.contactPrincipal.email
      );
      await this.page.fill(
        'input[name="contactPrincipal.telephone"]',
        identification.contactPrincipal.telephone
      );
    }

    // Contact Secondaire (if provided)
    if (identification.contactSecondaire) {
      await this.page.fill(
        'input[name="contactSecondaire.prenom"]',
        identification.contactSecondaire.prenom
      );
      await this.page.fill(
        'input[name="contactSecondaire.nom"]',
        identification.contactSecondaire.nom
      );
      await this.page.fill(
        'input[name="contactSecondaire.role"]',
        identification.contactSecondaire.role
      );
      await this.page.fill(
        'input[name="contactSecondaire.email"]',
        identification.contactSecondaire.email
      );
      await this.page.fill(
        'input[name="contactSecondaire.telephone"]',
        identification.contactSecondaire.telephone
      );
    }

    // Période d'autorisation (for autorisée structures)
    if (identification.debutPeriodeAutorisation) {
      const debutPeriodeDate =
        identification.debutPeriodeAutorisation.split("T")[0]; // Convert ISO to YYYY-MM-DD
      await this.page.fill(
        'input[name="debutPeriodeAutorisation"]',
        debutPeriodeDate
      );
    }
    if (identification.finPeriodeAutorisation) {
      const finPeriodeDate =
        identification.finPeriodeAutorisation.split("T")[0]; // Convert ISO to YYYY-MM-DD
      await this.page.fill(
        'input[name="finPeriodeAutorisation"]',
        finPeriodeDate
      );
    }

    // Convention (for subventionnée structures)
    if (identification.debutConvention) {
      const debutConventionDate = identification.debutConvention.split("T")[0]; // Convert ISO to YYYY-MM-DD
      await this.page.fill(
        'input[name="debutConvention"]',
        debutConventionDate
      );
    }
    if (identification.finConvention) {
      const finConventionDate = identification.finConvention.split("T")[0]; // Convert ISO to YYYY-MM-DD
      await this.page.fill('input[name="finConvention"]', finConventionDate);
    }
  }

  async submit(dnaCode: string) {
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL(
      `${process.env.NEXT_URL}/ajout-structure/${dnaCode}/02-adresses`
    );
  }
}
