import { Page } from "@playwright/test";

export type FinalisationBudgetData = {
  ETP: number;
  tauxEncadrement: number;
  coutJournalier: number;
  dotationDemandee?: number;
  dotationAccordee?: number;
  totalProduits?: number;
  totalChargesProposees?: number;
  totalCharges?: number;
  repriseEtat?: number;
  affectationReservesFondsDedies?: number;
};

export class FinalisationFinancePage {
  constructor(private page: Page) {}

  async waitForLoad() {
    await this.page.waitForSelector('button[type="submit"]', {
      timeout: 10000,
    });
  }

  async fillFinanceData(budgets: FinalisationBudgetData[]) {
    // Finance form has many required fields per year
    // Wait for the form to fully render
    await this.page.waitForTimeout(1000);

    // Fill required fields for each provided budget (typically 5 years)
    for (const [i, budget] of budgets.entries()) {
      // Basic indicators (required for all years)
      await this.page.fill(
        `input[name="budgets.${i}.ETP"]`,
        budget.ETP.toString()
      );
      await this.page.fill(
        `input[name="budgets.${i}.tauxEncadrement"]`,
        budget.tauxEncadrement.toString()
      );
      await this.page.fill(
        `input[name="budgets.${i}.coutJournalier"]`,
        budget.coutJournalier.toString()
      );

      // Optional fields - fill if provided
      if (budget.dotationDemandee !== undefined) {
        await this.page.fill(
          `input[name="budgets.${i}.dotationDemandee"]`,
          budget.dotationDemandee.toString()
        );
      }
      if (budget.dotationAccordee !== undefined) {
        await this.page.fill(
          `input[name="budgets.${i}.dotationAccordee"]`,
          budget.dotationAccordee.toString()
        );
      }
      if (budget.totalProduits !== undefined) {
        await this.page.fill(
          `input[name="budgets.${i}.totalProduits"]`,
          budget.totalProduits.toString()
        );
      }
      if (budget.totalChargesProposees !== undefined) {
        await this.page.fill(
          `input[name="budgets.${i}.totalChargesProposees"]`,
          budget.totalChargesProposees.toString()
        );
      }
      if (budget.totalCharges !== undefined) {
        await this.page.fill(
          `input[name="budgets.${i}.totalCharges"]`,
          budget.totalCharges.toString()
        );
      }
      if (budget.repriseEtat !== undefined) {
        await this.page.fill(
          `input[name="budgets.${i}.repriseEtat"]`,
          budget.repriseEtat.toString()
        );
      }
      if (budget.affectationReservesFondsDedies !== undefined) {
        await this.page.fill(
          `input[name="budgets.${i}.affectationReservesFondsDedies"]`,
          budget.affectationReservesFondsDedies.toString()
        );
      }

      // Small wait between years to allow form to process
      await this.page.waitForTimeout(100);
    }

    // Wait for any form calculations/validations to complete
    await this.page.waitForTimeout(500);
  }

  async submit() {
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(2000);
  }
}
