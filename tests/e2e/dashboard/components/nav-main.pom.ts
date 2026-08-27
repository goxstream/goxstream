import { type Page, type Locator } from '@playwright/test';

export class NavMainPOM {
  readonly page: Page;
  readonly managementGroupLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.managementGroupLabel = page.getByText(/Management & Studio/i);
  }

  async goto() {
    await this.page.goto('/dashboard');
  }
}
