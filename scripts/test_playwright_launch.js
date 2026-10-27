const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ 
      channel: 'chrome',
      headless: true 
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:5173');
    const title = await page.title();
    console.log('SUCCESS: Playwright connected via Google Chrome! Title:', title);
    await browser.close();
  } catch (err) {
    console.error('ERROR launching playwright with Chrome:', err);
    process.exit(1);
  }
})();
