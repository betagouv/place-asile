import { test } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";

// Mock the address API to avoid rate limiting
test.beforeEach(async ({ page }) => {
  // Mock the address API to return a consistent response
  await page.route(
    "https://api-adresse.data.gouv.fr/search/**",
    async (route) => {
      const mockResponse = {
        features: [
          {
            properties: {
              label: "1 Rue de la Paix, 75001 Paris",
              score: 0.9,
              housenumber: "1",
              street: "Rue de la Paix",
              postcode: "75001",
              city: "Paris",
              context: "75, Paris, Île-de-France",
              type: "housenumber",
              importance: 0.9,
              name: "1 Rue de la Paix",
              id: "75101_0001_1",
            },
            geometry: {
              coordinates: [2.3314, 48.8698],
            },
          },
        ],
      };
      await route.fulfill({ json: mockResponse });
    }
  );
});

import { AdressesPage } from "./helpers/page-objects/ajout/AdressesPage";
import { AuthenticationPage } from "./helpers/page-objects/ajout/AuthenticationPage";
import { ConfirmationPage } from "./helpers/page-objects/ajout/ConfirmationPage";
import { DocumentsPage } from "./helpers/page-objects/ajout/DocumentsPage";
import { IdentificationPage } from "./helpers/page-objects/ajout/IdentificationPage";
import { PresentationPage } from "./helpers/page-objects/ajout/PresentationPage";
import { TypePlacesPage } from "./helpers/page-objects/ajout/TypePlacesPage";
import { VerificationPage } from "./helpers/page-objects/ajout/VerificationPage";
import { deleteStructureViaApi } from "./helpers/structure-creator";
import { cadaSansCpom } from "./helpers/test-data";

// Increase timeout for full form flow
test.setTimeout(60000);

test("CADA sans CPOM - Flux complet de création", async ({ page }) => {
  // Add small delay to avoid rate limiting on address API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = {
    ...cadaSansCpom,
    dnaCode: `C${uuidv4()}`,
  };

  try {
    // Étape 0: Authentification
    const authPage = new AuthenticationPage(page);
    await authPage.authenticate(data.dnaCode);

    // Étape 0.5: Page de présentation
    const presentationPage = new PresentationPage(page);
    await presentationPage.navigateToFirstStep(data.dnaCode);

    // Étape 1: Identification
    const identificationPage = new IdentificationPage(page);
    await identificationPage.fillForm(data);
    await identificationPage.submit(data.dnaCode);

    // Étape 2: Adresses
    const adressesPage = new AdressesPage(page);
    await adressesPage.fillForm(data);
    await adressesPage.submit(data.dnaCode);

    // Étape 3: Type de places
    const typePlacesPage = new TypePlacesPage(page);
    await typePlacesPage.fillForm(data);
    await typePlacesPage.submit(data.dnaCode);

    // Étape 4: Documents
    const documentsPage = new DocumentsPage(page);
    await documentsPage.fillForm(data);
    await documentsPage.submit(data.dnaCode);

    // Étape 5: Vérification
    const verificationPage = new VerificationPage(page);
    await verificationPage.verifyData(data);
    await verificationPage.submit(data.dnaCode);

    // Étape 6: Confirmation
    const confirmationPage = new ConfirmationPage(page);
    await confirmationPage.verifySuccess();
  } finally {
    // Cleanup: Delete the created structure
    await deleteStructureViaApi(data.dnaCode);
  }
});
