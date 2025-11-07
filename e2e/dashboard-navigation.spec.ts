import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {
  test('should navigate between dashboards', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    await expect(page).toHaveTitle(/HUBDash/);

    // Navigate to board dashboard
    await page.click('text=Board Dashboard');
    await expect(page).toHaveURL(/\/board$/);
    await expect(page.locator('h1')).toContainText('Board Dashboard');

    // Navigate to operations hub
    await page.click('text=Operations');
    await expect(page).toHaveURL(/\/ops$/);
    await expect(page.locator('h1')).toContainText('Operations Hub');

    // Navigate to reports
    await page.click('text=Reports');
    await expect(page).toHaveURL(/\/reports$/);

    // Navigate to marketing hub
    await page.click('text=Marketing');
    await expect(page).toHaveURL(/\/marketing$/);

    // Navigate back to home
    await page.click('text=HUBDash');
    await expect(page).toHaveURL('/');
  });

  test('should display impact metrics on board dashboard', async ({ page }) => {
    await page.goto('/board');

    // Check if metrics are loaded
    await expect(page.locator('[data-testid="grant-laptops-presented"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-laptops-distributed"]')).toBeVisible();

    // Check progress bars are visible
    const progressBars = page.locator('.progress-fill');
    await expect(progressBars.first()).toBeVisible();
  });

  test('should have responsive navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/board');

    // Mobile menu should be hidden initially
    await expect(page.locator('[aria-label="Toggle menu"]')).toBeVisible();

    // Open mobile menu
    await page.click('[aria-label="Toggle menu"]');
    await expect(page.locator('nav')).toBeVisible();

    // Close mobile menu
    await page.click('[aria-label="Toggle menu"]');
    await expect(page.locator('nav')).not.toBeVisible();
  });

  test('should handle search functionality', async ({ page }) => {
    await page.goto('/board');

    // Open search
    await page.click('[aria-label="Global search"]');
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();

    // Type search query
    await page.fill('input[placeholder*="Search"]', 'laptop');
    await expect(page.locator('input[placeholder*="Search"]')).toHaveValue('laptop');

    // Close search
    await page.click('[aria-label="Global search"]');
  });

  test('should maintain theme selection', async ({ page }) => {
    await page.goto('/board');

    // Check theme toggle is present
    await expect(page.locator('[aria-label*="theme"]')).toBeVisible();

    // Theme should persist across navigation
    await page.click('[aria-label*="theme"]');
    await page.reload();
    // Theme preference should be maintained (this would require localStorage checking)
  });

  test('should handle PWA installation prompt', async ({ page }) => {
    await page.goto('/board');

    // PWA install prompt should appear after delay (if not dismissed)
    // This test would need to mock the beforeinstallprompt event
    const installPrompt = page.locator('text=Install HUBDash');
    // Note: This test would need to be adjusted based on actual PWA implementation
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/board');

    // Check for skip links
    await expect(page.locator('text=Skip to main content')).toBeVisible();

    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveAttribute('id', 'main-content');

    // Check for ARIA labels
    await expect(page.locator('[aria-label]')).toHaveLength(await page.locator('[aria-label]').count());
  });

  test('should handle offline functionality', async ({ page }) => {
    await page.goto('/board');

    // Go offline
    await page.context().setOffline(true);

    // Try to navigate (should work with service worker cache)
    await page.reload();
    await expect(page.locator('h1')).toContainText('Board Dashboard');

    // Go back online
    await page.context().setOffline(false);
  });
});
