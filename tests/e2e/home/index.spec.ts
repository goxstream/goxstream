import { test, expect } from '../fixtures/test.fixture';

test.describe('Home Page - Integration Test', () => {
  test('should load complete home page with correct title and sections', async ({ page, headerPOM, heroPOM }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/GoxStream/i);
    await expect(headerPOM.header).toBeVisible();
    await expect(heroPOM.heroSection).toBeVisible();
  });
});
