import { Page } from "@playwright/test";

import { Repartition } from "@/types/adresse.type";

import { TestStructureData } from "../../test-data";

export class AdressesPage {
  constructor(private page: Page) {}

  async fillForm(data: TestStructureData) {
    const { adresses } = data;

    // Nom (optional)
    if (adresses.nom) {
      await this.page.fill('input[name="nom"]', adresses.nom);
    }

    // Adresse administrative (autocomplete)
    await this.page.click('input[name="adresseAdministrativeComplete"]');
    await this.page.fill(
      'input[name="adresseAdministrativeComplete"]',
      adresses.adresseAdministrative.searchTerm
    );

    // Wait for autocomplete suggestions
    await this.page.waitForSelector('[role="option"]', {
      state: "visible",
      timeout: 5000,
    });

    // Click first suggestion
    await this.page.click('[role="option"]:first-child');

    // Wait for address to be populated
    await this.page.waitForTimeout(500);

    // Type de bâti - select dropdown
    await this.page.selectOption(
      'select[name="typeBati"]',
      this.getRepartitionLabel(adresses.typeBati)
    );

    // Wait for the UI to update after selecting type de bâti
    await this.page.waitForTimeout(500);

    // Same address toggle (only for COLLECTIF)
    if (adresses.sameAddress && adresses.typeBati === Repartition.COLLECTIF) {
      // Click the toggle switch
      await this.page.click('input[title="Adresse d\'hébergement identique"]');

      // Wait for the address to be auto-filled
      await this.page.waitForTimeout(500);

      // Fill places autorisées in the auto-filled address
      // The first address should now be populated
      await this.page.fill(
        'input[name="adresses.0.adresseTypologies.0.placesAutorisees"]',
        data.typologies[0].placesAutorisees.toString()
      );
    } else if (adresses.adresses) {
      // Handle multiple addresses (not same address)
      for (const [i, adresse] of adresses.adresses.entries()) {
        if (i > 0) {
          // Click "Add address" button for additional addresses
          await this.page.click('button:has-text("Ajouter une adresse")');
          await this.page.waitForTimeout(300);
        }

        // Fill address autocomplete
        await this.page.click(`input[name="adresses.${i}.adresseComplete"]`);
        await this.page.fill(
          `input[name="adresses.${i}.adresseComplete"]`,
          adresse.searchTerm
        );

        await this.page.waitForSelector('[role="option"]', {
          state: "visible",
          timeout: 5000,
        });
        await this.page.click('[role="option"]:first-child');

        await this.page.waitForTimeout(500);

        // Fill places autorisées
        await this.page.fill(
          `input[name="adresses.${i}.adresseTypologies.0.placesAutorisees"]`,
          adresse.placesAutorisees.toString()
        );

        // If type bâti is MIXTE, select repartition for each address
        if (adresses.typeBati === Repartition.MIXTE && adresse.repartition) {
          const repartitionSelector = `select[name="adresses.${i}.repartition"]`;
          await this.page.selectOption(
            repartitionSelector,
            this.getRepartitionLabel(adresse.repartition)
          );
        }
      }
    }
  }

  async submit(dnaCode: string) {
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL(
      `http://localhost:3000/ajout-structure/${dnaCode}/03-type-places`
    );
  }

  private getRepartitionLabel(repartition: Repartition): string {
    switch (repartition) {
      case Repartition.COLLECTIF:
        return "Collectif";
      case Repartition.DIFFUS:
        return "Diffus";
      case Repartition.MIXTE:
        return "Mixte";
      default:
        return repartition;
    }
  }
}
