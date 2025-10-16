import { Page } from "@playwright/test";

import { FinalisationAdressesPage } from "./page-objects/finalisation/FinalisationAdressesPage";
import { FinalisationFinancePage } from "./page-objects/finalisation/FinalisationFinancePage";
import { FinalisationIdentificationPage } from "./page-objects/finalisation/FinalisationIdentificationPage";
import { FinalisationNotesPage } from "./page-objects/finalisation/FinalisationNotesPage";
import { FinalisationQualitePage } from "./page-objects/finalisation/FinalisationQualitePage";
import { FinalisationTypePlacesPage } from "./page-objects/finalisation/FinalisationTypePlacesPage";
import { createStructureViaApi, getStructureId } from "./structure-creator";
import { TestStructureData } from "./test-data";

/**
 * Complete the entire "finalisation" flow for a structure through the UI
 * This helper encapsulates all the common steps to avoid code duplication
 *
 * Note: The structure is first created via API (in state A_FINALISER),
 * then the finalisation flow is completed through the UI.
 */
export async function completeFinalisationFlow(
  page: Page,
  testData: TestStructureData
): Promise<void> {
  // Step 0: Create structure via API (state: A_FINALISER by default)
  await createStructureViaApi(testData);
  const structureId = await getStructureId(testData.dnaCode);

  // Step 1: Navigate to finalisation form
  await page.goto(
    `http://localhost:3000/structures/${structureId}/finalisation/01-identification`
  );

  // Step 2: Identification (fields already populated from structure)
  const identificationPage = new FinalisationIdentificationPage(page);
  await identificationPage.waitForLoad();
  await identificationPage.submit(structureId);

  // Step 3: Adresses (fields already populated)
  const adressesPage = new FinalisationAdressesPage(page);
  await adressesPage.waitForLoad();
  await adressesPage.submit(structureId);

  // Step 4: Finance (skip for now - complex validation varies by structure type)
  const financePage = new FinalisationFinancePage(page);
  await financePage.waitForLoad();
  // Finance data is defined in test-data.ts for future comprehensive testing
  // await financePage.fillFinanceData(testData.finalisation!.finance!.budgets);
  await financePage.submit(structureId);

  // Step 5: Type Places (fill required fields)
  const typePlacesPage = new FinalisationTypePlacesPage(page);
  await typePlacesPage.waitForLoad();
  await typePlacesPage.fillPlacesData(testData.finalisation!.typePlaces!);
  await typePlacesPage.submit(structureId);

  // Step 6: Qualité (documents already created via API)
  const qualitePage = new FinalisationQualitePage(page);
  await qualitePage.waitForLoad();
  await qualitePage.submit(structureId);

  // Step 7: Notes (final step)
  const notesPage = new FinalisationNotesPage(page);
  await notesPage.waitForLoad();
  await notesPage.fillNotes(testData.finalisation!.notes!);
  await notesPage.submit(structureId);

  // Step 8: Verify success
  await notesPage.verifySuccess();
}
