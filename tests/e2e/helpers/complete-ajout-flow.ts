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
  const authPage = new AuthenticationPage(page);
  await authPage.authenticate(data.dnaCode);

  const presentationPage = new PresentationPage(page);
  await presentationPage.navigateToFirstStep(data.dnaCode);

  const identificationPage = new IdentificationPage(page);
  await identificationPage.fillForm(data);
  await identificationPage.submit(data.dnaCode);

  const adressesPage = new AdressesPage(page);
  await adressesPage.fillForm(data);
  await adressesPage.submit(data.dnaCode);

  const typePlacesPage = new TypePlacesPage(page);
  await typePlacesPage.fillForm(data);
  await typePlacesPage.submit(data.dnaCode);

  const documentsPage = new DocumentsPage(page);
  await documentsPage.fillForm(data);
  await documentsPage.submit(data.dnaCode);

  const verificationPage = new VerificationPage(page);
  await verificationPage.verifyData(data);
  await verificationPage.submit(data.dnaCode);

  const confirmationPage = new ConfirmationPage(page);
  await confirmationPage.verifySuccess();
}
