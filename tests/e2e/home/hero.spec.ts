import { test, expect } from '../fixtures/test.fixture';

test.describe('Home Page - Hero Component', () => {
  test('should display hero section and primary heading', async ({ heroPOM }) => {
    await heroPOM.goto();
    await expect(heroPOM.heroSection).toBeVisible();
  });
});
