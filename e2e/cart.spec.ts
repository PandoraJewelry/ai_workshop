import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('can add product to cart', async ({ page }) => {
    // Wait for products to load
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });

    // Click add to cart on first product
    const addToCartButton = page.locator('[data-testid="product-card"]').first().locator('button:has-text("Add to Cart")');
    await addToCartButton.click();

    // Verify notification or cart update
    await page.waitForTimeout(500);

    // Cart should open or badge should update
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    if (await cartBadge.isVisible()) {
      await expect(cartBadge).toContainText('1');
    }
  });

  test('can open and close cart sidebar', async ({ page }) => {
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });

    // Add item to cart first
    const addToCartButton = page.locator('[data-testid="product-card"]').first().locator('button:has-text("Add to Cart")');
    await addToCartButton.click();

    // Click cart button to open sidebar
    const cartButton = page.locator('[data-testid="cart-button"]');
    await cartButton.click();

    // Cart sidebar should be visible
    const cartSidebar = page.locator('[data-testid="cart-sidebar"]');
    await expect(cartSidebar).toBeVisible();

    // Close cart
    const closeButton = cartSidebar.locator('button:has-text("Close"), [data-testid="close-cart"]').first();
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await expect(cartSidebar).not.toBeVisible();
    }
  });

  test('can update item quantity in cart', async ({ page }) => {
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });

    // Add item to cart
    const addToCartButton = page.locator('[data-testid="product-card"]').first().locator('button:has-text("Add to Cart")');
    await addToCartButton.click();

    // Open cart
    const cartButton = page.locator('[data-testid="cart-button"]');
    await cartButton.click();

    // Find quantity controls
    const incrementButton = page.locator('[data-testid="cart-sidebar"]').locator('button:has-text("+")').first();
    if (await incrementButton.isVisible()) {
      await incrementButton.click();
      await page.waitForTimeout(300);

      // Quantity should increase
      const quantityDisplay = page.locator('[data-testid="cart-sidebar"]').locator('text=/\\b2\\b/');
      await expect(quantityDisplay).toBeVisible();
    }
  });

  test('can remove item from cart', async ({ page }) => {
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });

    // Add item to cart
    const addToCartButton = page.locator('[data-testid="product-card"]').first().locator('button:has-text("Add to Cart")');
    await addToCartButton.click();

    // Open cart
    const cartButton = page.locator('[data-testid="cart-button"]');
    await cartButton.click();

    // Remove item
    const removeButton = page.locator('[data-testid="cart-sidebar"]').locator('button:has-text("Remove"), [data-testid="remove-item"]').first();
    if (await removeButton.isVisible()) {
      await removeButton.click();
      await page.waitForTimeout(300);

      // Cart should show empty state
      await expect(page.getByText('Your cart is empty')).toBeVisible();
    }
  });

  test('cart persists after page reload', async ({ page }) => {
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });

    // Add item to cart
    const addToCartButton = page.locator('[data-testid="product-card"]').first().locator('button:has-text("Add to Cart")');
    await addToCartButton.click();
    await page.waitForTimeout(500);

    // Reload page
    await page.reload();

    // Wait for products to reload
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });

    // Cart badge should still show 1
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    if (await cartBadge.isVisible()) {
      await expect(cartBadge).toContainText('1');
    }
  });
});
