import { type Page, type Locator } from '@playwright/test';

export class HeaderPOM {
  readonly page: Page;
  readonly header: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header');
    this.logo = page.locator('header').getByRole('link', { name: /goxstream/i });
  }

  async goto() {
    await this.page.goto('/');
  }
}
