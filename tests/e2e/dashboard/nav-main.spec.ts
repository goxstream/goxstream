import { test, expect } from '../fixtures/test.fixture';

test.describe('Dashboard Page - Nav Main Component', () => {
  test('should display management group label in dashboard navigation', async ({ navMainPOM }) => {
    await navMainPOM.goto();
    await expect(navMainPOM.managementGroupLabel).toBeVisible();
  });
});
