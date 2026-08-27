import { test, expect } from '../fixtures/test.fixture';

test.describe('Dashboard Page - Integration Test', () => {
  test('should render dashboard layout with main navigation', async ({ page, navMainPOM }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(navMainPOM.managementGroupLabel).toBeVisible();
  });
});
