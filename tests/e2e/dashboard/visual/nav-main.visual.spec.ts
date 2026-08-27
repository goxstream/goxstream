import { test, expect } from '../../fixtures/test.fixture';

test.describe('Dashboard Page - NavMain Visual Regression @visual', () => {
  test('nav-main component should match visual snapshot', async ({ navMainPOM }) => {
    await navMainPOM.goto();
    await expect(navMainPOM.managementGroupLabel).toHaveScreenshot('dashboard-nav-main-label.png');
  });
});
