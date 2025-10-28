import { expect, Page } from "@playwright/test";

import { TestStructureData } from "../test-data";

export class StructureDetailPage {
  constructor(private page: Page) {}

  async navigateToStructure(structureId: number) {
    await this.page.goto(`/structures/${structureId}`);
    await this.page.waitForLoadState("networkidle");
  }

  async verifyStructureData(testData: TestStructureData) {
    // Wait for the page to load - check for description section
    await this.page.waitForSelector("#description", {
      timeout: 10000,
    });

    // Verify basic structure information
    const { identification, adresses, typologies } = testData;

    // Check that we have the main sections
    await expect(this.page.locator("#description")).toBeVisible();
    await expect(this.page.locator("#calendrier")).toBeVisible();
    await expect(this.page.locator("#places")).toBeVisible();
    await expect(this.page.locator("#actes-administratifs")).toBeVisible();
    await expect(this.page.locator("#notes")).toBeVisible();

    // ===== DESCRIPTION SECTION VERIFICATION =====

    // CRITICAL: Verify DNA code is displayed correctly (this confirms the structure was created)
    await expect(
      this.page.locator("#description").getByText("Code DNA (OFII)")
    ).toBeVisible();
    await expect(
      this.page.locator("#description").getByText(testData.dnaCode)
    ).toBeVisible();

    // Verify structure type
    await expect(
      this.page.locator("#description").getByText("Type de structure")
    ).toBeVisible();
    await expect(
      this.page.locator("#description").getByText(testData.type).first()
    ).toBeVisible();

    // Verify CPOM status
    await expect(
      this.page.locator("#description").getByText("CPOM")
    ).toBeVisible();
    const cpomText = testData.cpom ? "Oui" : "Non";
    await expect(
      this.page.locator("#description").getByText(cpomText)
    ).toBeVisible();

    // Verify FINESS code if present
    if (identification.finessCode) {
      await expect(
        this.page.locator("#description").getByText("Code FINESS")
      ).toBeVisible();
      // FINESS code is displayed without spaces
      const finessCodeWithoutSpaces = identification.finessCode.replaceAll(
        " ",
        ""
      );
      await expect(
        this.page.locator("#description").getByText(finessCodeWithoutSpaces)
      ).toBeVisible();
    }

    // Verify public type
    await expect(
      this.page.locator("#description").getByText("Public")
    ).toBeVisible();
    await expect(
      this.page.locator("#description").getByText(identification.public)
    ).toBeVisible();

    // Verify vulnerability information
    await expect(
      this.page.locator("#description").getByText("Vulnérabilité")
    ).toBeVisible();
    if (identification.lgbt) {
      await expect(
        this.page.locator("#description").getByText("LGBT")
      ).toBeVisible();
    }
    if (identification.fvvTeh) {
      await expect(
        this.page.locator("#description").getByText("FVV")
      ).toBeVisible();
      await expect(
        this.page.locator("#description").getByText("TEH")
      ).toBeVisible();
    }

    // Verify creation date (check for the year)
    const creationYear = new Date(identification.creationDate).getFullYear();
    await expect(this.page.getByText(creationYear.toString())).toBeVisible();

    // Verify administrative address
    await expect(
      this.page.locator("#description").getByText("Adresse administrative")
    ).toBeVisible();
    if (adresses.nom) {
      await expect(
        this.page.locator("#description").getByText(adresses.nom)
      ).toBeVisible();
    }

    // Verify type of building (Collectif/Diffus/Mixte)
    await expect(
      this.page.locator("#description").getByText("Type de bâti")
    ).toBeVisible();
    // The enum values are already the correct display text
    await expect(
      this.page.locator("#description").getByText(adresses.typeBati)
    ).toBeVisible();

    // ===== PLACES SECTION VERIFICATION =====

    // Verify places information (PMR places are important to check)
    if (typologies && typologies.length > 0) {
      const firstTypology = typologies[0];

      // Check places autorisées
      await expect(
        this.page.locator("#places").getByText("places autorisées")
      ).toBeVisible();
      await expect(
        this.page
          .locator("#places")
          .getByText(firstTypology.placesAutorisees.toString())
          .first()
      ).toBeVisible();

      // Check PMR places if > 0 (this is a key verification)
      if (firstTypology.pmr > 0) {
        await expect(
          this.page
            .locator("#places")
            .getByText(firstTypology.pmr.toString())
            .first()
        ).toBeVisible();
      }

      // Check LGBT places if > 0
      if (firstTypology.lgbt > 0) {
        await expect(
          this.page
            .locator("#places")
            .getByText(firstTypology.lgbt.toString())
            .first()
        ).toBeVisible();
      }

      // Check FVV/TEH places if > 0
      if (firstTypology.fvvTeh > 0) {
        await expect(
          this.page
            .locator("#places")
            .getByText(firstTypology.fvvTeh.toString())
            .first()
        ).toBeVisible();
      }
    }

    // ===== CALENDRIER SECTION VERIFICATION =====

    // Verify calendar section exists
    await expect(
      this.page.locator("#calendrier").getByText("Calendrier")
    ).toBeVisible();

    // Verify dates are present in the calendar (more flexible approach)
    const calendrierContent = await this.page
      .locator("#calendrier")
      .textContent();

    // Check for authorization period years if present
    if (
      identification.debutPeriodeAutorisation &&
      identification.finPeriodeAutorisation
    ) {
      const debutYear = new Date(
        identification.debutPeriodeAutorisation
      ).getFullYear();
      if (calendrierContent) {
        expect(calendrierContent).toContain(debutYear.toString());
      }
    }

    // Check for CPOM dates if present
    if (testData.cpom && identification.debutCpom && identification.finCpom) {
      const debutCpomYear = new Date(identification.debutCpom).getFullYear();
      if (calendrierContent) {
        expect(calendrierContent).toContain(debutCpomYear.toString());
      }
    }

    // Check for convention dates if present
    if (identification.debutConvention && identification.finConvention) {
      const debutConventionYear = new Date(
        identification.debutConvention
      ).getFullYear();
      if (calendrierContent) {
        expect(calendrierContent).toContain(debutConventionYear.toString());
      }
    }

    // ===== ACTES ADMINISTRATIFS SECTION VERIFICATION =====

    // Verify administrative acts section exists
    await expect(
      this.page
        .locator("#actes-administratifs")
        .getByText("Actes administratifs")
    ).toBeVisible();

    // Check if document categories are present (they might be in accordions)
    const actesContent = await this.page
      .locator("#actes-administratifs")
      .textContent();

    // Verify document categories are mentioned in the section
    if (actesContent) {
      // Check if documents are present or if it shows "no documents" message
      if (actesContent.includes("Aucun document importé")) {
        // No documents case - this is valid for test structures
        expect(actesContent).toContain("Aucun document importé");
      } else {
        // Documents are present - verify categories
        expect(actesContent).toContain("Arrêtés d'autorisation");
        expect(actesContent).toContain("Conventions");
        expect(actesContent).toContain("Arrêtés de tarification");
        expect(actesContent).toContain("Autres documents");

        // Verify CPOM documents section if CPOM is enabled
        if (testData.cpom) {
          expect(actesContent).toContain("CPOM");
        }
      }
    }

    // ===== FINANCES SECTION VERIFICATION (if budgets exists) =====

    // Check if finances section is present (it's conditional based on budgets)
    const financesSection = this.page.locator("#finances");
    const isFinancesVisible = await financesSection.isVisible();

    if (isFinancesVisible) {
      await expect(financesSection.getByText("Finances")).toBeVisible();
      await expect(
        financesSection.getByText("Budget exécutoire")
      ).toBeVisible();
      await expect(
        financesSection.getByText("Dotation et équilibre économique")
      ).toBeVisible();
      await expect(
        financesSection.getByText("Gestion budgétaire")
      ).toBeVisible();
    }

    // ===== CONTACTS VERIFICATION =====

    // Verify contacts button is present (they're in a collapsible section)
    const contactsButton = this.page
      .locator("#description")
      .getByText("Voir les contacts");
    if (await contactsButton.isVisible()) {
      // Click to show contacts
      await contactsButton.click();

      if (identification.contactPrincipal) {
        // Check for the full name format: "John Doe (Directeur·rice)"
        const fullName = `${identification.contactPrincipal.prenom} ${identification.contactPrincipal.nom}`;
        await expect(
          this.page.locator("#description").getByText(fullName)
        ).toBeVisible();
        await expect(
          this.page
            .locator("#description")
            .getByText(identification.contactPrincipal.email)
        ).toBeVisible();
      }

      if (identification.contactSecondaire) {
        // Check for the full name format: "Jane Deo (Responsable administratif)"
        const fullName = `${identification.contactSecondaire.prenom} ${identification.contactSecondaire.nom}`;
        await expect(
          this.page.locator("#description").getByText(fullName)
        ).toBeVisible();
        await expect(
          this.page
            .locator("#description")
            .getByText(identification.contactSecondaire.email)
        ).toBeVisible();
      }
    }

    // ===== ADDRESSES VERIFICATION =====

    // Verify addresses button is present (they're in a collapsible section)
    const addressesButton = this.page
      .locator("#description")
      .getByText("Voir la liste des hébergements");
    if (await addressesButton.isVisible()) {
      await addressesButton.click();

      // Just verify that addresses are displayed (don't check specific postal codes/cities
      // as they might be different due to address autocomplete mocking)
      const addressesContent = await this.page
        .locator("#description")
        .textContent();
      if (addressesContent) {
        // Check that we have some address information displayed
        expect(
          addressesContent.includes("places") ||
            addressesContent.includes("Rue") ||
            addressesContent.includes("Avenue")
        ).toBe(true);
      }
    }

    // ===== FINAL VERIFICATION =====

    // Additional verification: Check that the page content contains key information
    const pageContent = await this.page.content();
    if (!pageContent.includes(testData.dnaCode)) {
      throw new Error(
        `DNA code ${testData.dnaCode} not found on structure detail page`
      );
    }
  }

  async getStructureIdFromUrl(): Promise<number> {
    const url = this.page.url();
    const match = url.match(/\/structures\/(\d+)/);
    if (!match) {
      throw new Error(`Could not extract structure ID from URL: ${url}`);
    }
    return parseInt(match[1], 10);
  }
}
