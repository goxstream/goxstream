import { test, expect } from '../../fixtures/test.fixture';

test.describe('Home Page - Hero Visual Regression @visual', () => {
  test('hero component should match visual snapshot', async ({ heroPOM }) => {
    await heroPOM.goto();
    await expect(heroPOM.heroSection).toHaveScreenshot('home-hero.png');
  });
});
