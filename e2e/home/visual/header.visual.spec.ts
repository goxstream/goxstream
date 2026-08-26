import { test, expect } from '../../fixtures/test.fixture';

test.describe('Home Page - Header Visual Regression @visual', () => {
  test('header component should match visual snapshot', async ({ headerPOM }) => {
    await headerPOM.goto();
    await expect(headerPOM.header).toHaveScreenshot('home-header.png');
  });
});
