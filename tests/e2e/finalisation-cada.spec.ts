import { test } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";

import { FinalisationAdressesPage } from "./helpers/page-objects/finalisation/FinalisationAdressesPage";
import { FinalisationFinancePage } from "./helpers/page-objects/finalisation/FinalisationFinancePage";
import { FinalisationIdentificationPage } from "./helpers/page-objects/finalisation/FinalisationIdentificationPage";
import { FinalisationNotesPage } from "./helpers/page-objects/finalisation/FinalisationNotesPage";
import { FinalisationQualitePage } from "./helpers/page-objects/finalisation/FinalisationQualitePage";
import { FinalisationTypePlacesPage } from "./helpers/page-objects/finalisation/FinalisationTypePlacesPage";
import {
  createStructureViaApi,
  getStructureId,
} from "./helpers/structure-creator";
import { cadaSansCpom } from "./helpers/test-data";

// Increase timeout for full finalisation flow
test.setTimeout(120000);

test("Finalisation CADA sans CPOM - Flux complet", async ({ page }) => {
  const testData = {
    ...cadaSansCpom,
    dnaCode: `C${uuidv4()}`,
  };

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

  // Step 4: Finance (skip - varies by structure type)
  const financePage = new FinalisationFinancePage(page);
  await financePage.waitForLoad();
  await financePage.submit(structureId);

  // Step 5: Type Places (fill required fields)
  const typePlacesPage = new FinalisationTypePlacesPage(page);
  await typePlacesPage.waitForLoad();
  await typePlacesPage.fillPlacesData();
  await typePlacesPage.submit(structureId);

  // Step 6: Qualité (documents already created via API)
  const qualitePage = new FinalisationQualitePage(page);
  await qualitePage.waitForLoad();
  await qualitePage.submit(structureId);

  // Step 7: Notes (final step)
  const notesPage = new FinalisationNotesPage(page);
  await notesPage.waitForLoad();
  await notesPage.fillNotes();
  await notesPage.submit(structureId);

  // Step 8: Verify success
  await notesPage.verifySuccess();
});
