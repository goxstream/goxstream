import { type Page, type Locator } from '@playwright/test';

export class SidebarPOM {
  readonly page: Page;
  readonly sidebarContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebarContainer = page.locator('[data-sidebar="sidebar"]').first();
  }

  async goto() {
    await this.page.goto('/dashboard');
  }
}
