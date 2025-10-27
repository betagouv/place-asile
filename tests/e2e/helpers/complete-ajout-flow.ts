import { Page } from "@playwright/test";

import { AdressesPage } from "./page-objects/ajout/AdressesPage";
import { AuthenticationPage } from "./page-objects/ajout/AuthenticationPage";
import { ConfirmationPage } from "./page-objects/ajout/ConfirmationPage";
import { DocumentsPage } from "./page-objects/ajout/DocumentsPage";
import { IdentificationPage } from "./page-objects/ajout/IdentificationPage";
import { PresentationPage } from "./page-objects/ajout/PresentationPage";
import { TypePlacesPage } from "./page-objects/ajout/TypePlacesPage";
import { VerificationPage } from "./page-objects/ajout/VerificationPage";
import { TestStructureData } from "./test-data";

/**
 * Complete the entire "ajout" flow for a structure through the UI
 * This helper encapsulates all the common steps to avoid code duplication
 */
export async function completeAjoutFlow(
  page: Page,
  data: TestStructureData
): Promise<void> {
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
}
