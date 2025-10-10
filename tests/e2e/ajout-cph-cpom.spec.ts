import { test } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";

import { AdressesPage } from "./helpers/page-objects/ajout/AdressesPage";
import { AuthenticationPage } from "./helpers/page-objects/ajout/AuthenticationPage";
import { ConfirmationPage } from "./helpers/page-objects/ajout/ConfirmationPage";
import { DocumentsPage } from "./helpers/page-objects/ajout/DocumentsPage";
import { IdentificationPage } from "./helpers/page-objects/ajout/IdentificationPage";
import { TypePlacesPage } from "./helpers/page-objects/ajout/TypePlacesPage";
import { VerificationPage } from "./helpers/page-objects/ajout/VerificationPage";
import { CPH_AVEC_CPOM_DATA } from "./helpers/test-data";

// Increase timeout for full form flow
test.setTimeout(30000);

test("CPH avec CPOM - Flux complet de création", async ({ page }) => {
  const data = {
    ...CPH_AVEC_CPOM_DATA,
    dnaCode: `R${uuidv4()}`,
  };

  // Étape 0: Authentification
  const authPage = new AuthenticationPage(page);
  await authPage.authenticate(data.dnaCode);

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
});
