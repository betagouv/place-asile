import { Page } from "@playwright/test";

import { FinalisationIdentificationPage } from "./page-objects/finalisation/FinalisationIdentificationPage";
import { FinalisationNotesPage } from "./page-objects/finalisation/FinalisationNotesPage";
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
  await createStructureViaApi(testData);
  const structureId = await getStructureId(testData.dnaCode);

  await page.goto(
    `${process.env.NEXT_URL}/structures/${structureId}/finalisation/01-identification`
  );

  const identificationPage = new FinalisationIdentificationPage(page);
  await identificationPage.waitForLoad();
  await identificationPage.submit();

  await page.goto(
    `${process.env.NEXT_URL}/structures/${structureId}/finalisation/02-documents-financiers`
  );

  await page.goto(
    `${process.env.NEXT_URL}/structures/${structureId}/finalisation/03-finance`
  );
  await page.waitForTimeout(1000);

  const controlesTab = page.locator('a[href*="04-controles"]');
  await controlesTab.click();
  await page.waitForURL(
    `${process.env.NEXT_URL}/structures/${structureId}/finalisation/04-controles`,
    { timeout: 10000 }
  );

  const documentsTab = page.locator('a[href*="05-documents"]');
  await documentsTab.click();
  await page.waitForURL(
    `${process.env.NEXT_URL}/structures/${structureId}/finalisation/05-documents`,
    { timeout: 10000 }
  );

  const notesTab = page.locator('a[href*="06-notes"]');
  await notesTab.click();
  await page.waitForURL(
    `${process.env.NEXT_URL}/structures/${structureId}/finalisation/06-notes`,
    { timeout: 10000 }
  );

  const notesPage = new FinalisationNotesPage(page);
  await notesPage.waitForLoad();
  await notesPage.fillNotes(testData.finalisation!.notes!);
  await notesPage.submit();

  await page.waitForURL(
    `${process.env.NEXT_URL}/structures/${structureId}/finalisation/06-notes`,
    { timeout: 10000 }
  );
}
