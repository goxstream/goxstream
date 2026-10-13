import { test, expect } from '../../fixtures/test.fixture';
import { SidebarPOM } from '../components/sidebar.pom';

test.describe('Dashboard Page - Sidebar Visual Regression @visual', () => {
  test('sidebar component should match visual snapshot', async ({ page }) => {
    const sidebarPOM = new SidebarPOM(page);
    await sidebarPOM.goto();
    await expect(sidebarPOM.sidebarContainer).toHaveScreenshot('dashboard-sidebar.png');
  });
});
