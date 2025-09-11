const { _electron: electron } = require('@playwright/test');
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('EasyEdit Electron Tests', () => {
  let app;
  let window;

  test.beforeAll(async () => {
    // Launch with more verbose logging
    app = await electron.launch({ 
      args: ['.'],
      env: {
        ...process.env,
        ELECTRON_ENABLE_LOGGING: '1'
      }
    });
    window = await app.firstWindow();
  });

  test.afterAll(async () => {
    await app.close();
  });

  test('launches with correct window title', async () => {
    await window.waitForLoadState('domcontentloaded');
    console.log('Window loaded');
    
    const html = await window.innerHTML('html');
    console.log('HTML content:', html);
    
    const title = await window.title();
    console.log('Window title:', title);
    
    expect(title).toBe('EasyEdit');
  });
});