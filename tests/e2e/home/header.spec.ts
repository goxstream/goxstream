import { test, expect } from '../fixtures/test.fixture';

test.describe('Home Page - Header Component', () => {
  test('should render site header and navigation', async ({ headerPOM }) => {
    await headerPOM.goto();
    await expect(headerPOM.header).toBeVisible();
  });
});
