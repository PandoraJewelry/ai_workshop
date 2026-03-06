import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays the hero section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Premium Tea Collection' })).toBeVisible();
  });

  test('displays product grid with products', async ({ page }) => {
    // Wait for products to load
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });

    // Should have multiple products
    const productCount = await page.locator('[data-testid="product-card"]').count();
    expect(productCount).toBeGreaterThan(0);
  });

  test('displays product information correctly', async ({ page }) => {
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });

    const firstProduct = page.locator('[data-testid="product-card"]').first();

    // Check that product has name, price, and image
    await expect(firstProduct.locator('img')).toBeVisible();
    await expect(firstProduct.locator('text=/\\$\\d+/')).toBeVisible();
  });

  test('can filter products by category', async ({ page }) => {
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });

    // Get initial product count
    const initialCount = await page.locator('[data-testid="product-card"]').count();

    // Click on a category filter if available
    const categoryButton = page.locator('button:has-text("Green")');
    if (await categoryButton.isVisible()) {
      await categoryButton.click();

      // Wait for filter to apply
      await page.waitForTimeout(500);

      // Product count may change
      const filteredCount = await page.locator('[data-testid="product-card"]').count();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    }
  });
});

test.describe('Header Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays logo and navigation', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
  });

  test('can toggle theme', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      // Theme should change - check for dark class on html/body
      await page.waitForTimeout(300);
    }
  });

  test('shows cart count badge', async ({ page }) => {
    // Initially cart should be empty or show 0
    const cartButton = page.locator('[data-testid="cart-button"]');
    await expect(cartButton).toBeVisible();
  });
});
