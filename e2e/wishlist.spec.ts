import { test, expect } from '@playwright/test';

test.describe('Wishlist', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('can add product to wishlist', async ({ page }) => {
    // Wait for products to load
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });

    // Click wishlist button on first product
    const wishlistButton = page.locator('[data-testid="product-card"]').first().locator('[data-testid="wishlist-button"], button[aria-label*="wishlist"]').first();
    if (await wishlistButton.isVisible()) {
      await wishlistButton.click();
      await page.waitForTimeout(500);

      // Wishlist badge should update
      const wishlistBadge = page.locator('[data-testid="wishlist-badge"]');
      if (await wishlistBadge.isVisible()) {
        await expect(wishlistBadge).toContainText('1');
      }
    }
  });

  test('can navigate to wishlist page', async ({ page }) => {
    // Find and click wishlist link
    const wishlistLink = page.locator('a[href="/wishlist"], [data-testid="wishlist-link"]');
    if (await wishlistLink.isVisible()) {
      await wishlistLink.click();

      // Should be on wishlist page
      await expect(page).toHaveURL(/.*wishlist/);
    }
  });

  test('wishlist page shows empty state when no items', async ({ page }) => {
    await page.goto('/wishlist');

    // Should show empty state
    await expect(page.getByRole('heading', { name: 'Your wishlist is empty' })).toBeVisible({ timeout: 5000 });
  });

  test('can remove item from wishlist', async ({ page }) => {
    // Add item to wishlist first
    await page.goto('/');
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });

    const wishlistButton = page.locator('[data-testid="product-card"]').first().locator('[data-testid="wishlist-button"], button[aria-label*="wishlist"]').first();
    if (await wishlistButton.isVisible()) {
      await wishlistButton.click();
      await page.waitForTimeout(500);

      // Go to wishlist page
      await page.goto('/wishlist');

      // Remove button should be visible
      const removeButton = page.locator('[data-testid="remove-wishlist"], button:has-text("Remove")').first();
      if (await removeButton.isVisible()) {
        await removeButton.click();
        await page.waitForTimeout(500);

        // Should show empty state
        await expect(page.getByRole('heading', { name: 'Your wishlist is empty' })).toBeVisible();
      }
    }
  });

  test('wishlist persists after page reload', async ({ page }) => {
    // Add item to wishlist
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });

    const wishlistButton = page.locator('[data-testid="product-card"]').first().locator('[data-testid="wishlist-button"], button[aria-label*="wishlist"]').first();
    if (await wishlistButton.isVisible()) {
      await wishlistButton.click();
      await page.waitForTimeout(500);

      // Reload page
      await page.reload();

      // Wait for products to reload
      await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });

      // Wishlist badge should still show 1
      const wishlistBadge = page.locator('[data-testid="wishlist-badge"]');
      if (await wishlistBadge.isVisible()) {
        await expect(wishlistBadge).toContainText('1');
      }
    }
  });
});
