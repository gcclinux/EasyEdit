import { test, expect } from '@playwright/test';

test.describe('Browser Mode Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the local dev server
    await page.goto('http://localhost:3024');
  });

  test('loads and displays markdown content', async ({ page }) => {
    const textarea = page.locator('.editor textarea');
    const preview = page.locator('.preview');
    
    // Type some markdown in the editor
    await textarea.fill('# Test Heading\n\nThis is a test paragraph');
    
    // Check if preview updates
    await expect(preview.locator('h1')).toHaveText('Test Heading');
    await expect(preview.locator('p')).toHaveText('This is a test paragraph');
  });

  test('toolbar buttons functionality', async ({ page }) => {
    const textarea = page.locator('.editor textarea');
    
    // Test Bold
    await page.getByRole('button', { name: 'Bold' }).click();
    await expect(textarea).toHaveValue('****');
    
    // Clear and test Italic
    await textarea.fill('');
    await page.getByRole('button', { name: 'Italic' }).click();
    await expect(textarea).toHaveValue('__');
  });

  test('real-time preview updates', async ({ page }) => {
    const textarea = page.locator('.editor textarea');
    const preview = page.locator('.preview');

    // Type content gradually
    await textarea.type('# Hello');
    await expect(preview.locator('h1')).toHaveText('Hello');

    await textarea.type('\n\nWorld');
    await expect(preview.locator('p')).toHaveText('World');
  });

  test('layout toggles', async ({ page }) => {
    // Test horizontal layout
    await page.getByRole('button', { name: 'Toggle Layout' }).click();
    await expect(page.locator('.horizontal')).toBeVisible();

    // Test full screen edit
    await page.getByRole('button', { name: 'Toggle Edit Full' }).click();
    await expect(page.locator('.edit-full')).toBeVisible();

    // Test full screen preview
    await page.getByRole('button', { name: 'Toggle Preview Full' }).click();
    await expect(page.locator('.preview-full')).toBeVisible();
  });
});