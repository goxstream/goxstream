import { type Page, type Locator } from '@playwright/test';

export class HeroPOM {
  readonly page: Page;
  readonly heroSection: Locator;
  readonly mainHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroSection = page.locator('main section').first();
    this.mainHeading = page.locator('h1');
  }

  async goto() {
    await this.page.goto('/');
  }
}
