const { BASE_URL, createBrowserContext } = require('./fixtures');

async function runNavigationTests(reporter) {
  console.log('\n--- MODULE 1: Navigation & Routing Tests ---');
  const ctx = await createBrowserContext();
  const { page, captureScreenshot } = ctx;

  try {
    // 1.1 Homepage Load
    const t0 = Date.now();
    try {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('text=Lookman', { timeout: 5000 });
      const title = await page.title();
      if (!title.includes('Lookman')) throw new Error(`Expected title to include "Lookman", got "${title}"`);
      const shot = await captureScreenshot('nav_home_loaded');
      reporter.record({
        id: 'NAV-01',
        module: 'Navigation',
        name: 'Homepage load and brand title validation',
        status: 'PASS',
        durationMs: Date.now() - t0,
        screenshot: shot
      });
    } catch (err) {
      const shot = await captureScreenshot('nav_home_failed');
      reporter.record({
        id: 'NAV-01',
        module: 'Navigation',
        name: 'Homepage load and brand title validation',
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: err,
        screenshot: shot
      });
    }

    // 1.2 Header Menu Links Navigation
    const routesToTest = [
      { name: 'About Us', hash: '#about', selector: 'header nav button:has-text("About Us")', checkText: '35+ Years of Trusted' },
      { name: 'Products', hash: '#products', selector: 'header nav button:has-text("Products")', checkSelector: '.product-card-item' },
      { name: 'Solutions', hash: '#solutions', selector: 'header nav button:has-text("Solutions")', checkText: 'Safe School Solution' },
      { name: 'Brands', hash: '#brands', selector: 'header nav button:has-text("Brands")', checkText: 'Color On Surveillance Systems' },
      { name: 'Contact', hash: '#contact', selector: 'header nav button:has-text("Contact")', checkText: 'Head Office Information' }
    ];

    for (const item of routesToTest) {
      const t = Date.now();
      try {
        const link = page.locator(item.selector).first();
        await link.click();
        await page.waitForTimeout(600);
        const currentUrl = page.url();
        if (!currentUrl.includes(item.hash)) {
          throw new Error(`URL did not contain ${item.hash}, actual: ${currentUrl}`);
        }
        if (item.checkSelector) {
          await page.waitForSelector(item.checkSelector, { timeout: 5000 });
        } else {
          await page.waitForSelector(`text="${item.checkText}"`, { timeout: 5000 });
        }
        const shot = await captureScreenshot(`nav_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`);
        reporter.record({
          id: `NAV-${item.name.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`,
          module: 'Navigation',
          name: `Navigate to ${item.name} via header (${item.hash})`,
          status: 'PASS',
          durationMs: Date.now() - t,
          screenshot: shot
        });
      } catch (err) {
        const shot = await captureScreenshot(`nav_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_fail`);
        reporter.record({
          id: `NAV-${item.name.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`,
          module: 'Navigation',
          name: `Navigate to ${item.name} via header (${item.hash})`,
          status: 'FAIL',
          durationMs: Date.now() - t,
          error: err,
          screenshot: shot
        });
      }
    }

    // 1.3 Direct Calculator Route Navigation
    const tCalcNav = Date.now();
    try {
      await page.goto(`${BASE_URL}/#calculator`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('text=Calculator', { timeout: 4000 });
      reporter.record({
        id: 'NAV-CALCULATOR-ROUTE',
        module: 'Navigation',
        name: 'Direct URL routing to Calculator view (/#calculator)',
        status: 'PASS',
        durationMs: Date.now() - tCalcNav
      });
    } catch (err) {
      reporter.record({
        id: 'NAV-CALCULATOR-ROUTE',
        module: 'Navigation',
        name: 'Direct URL routing to Calculator view (/#calculator)',
        status: 'FAIL',
        durationMs: Date.now() - tCalcNav,
        error: err
      });
    }

    // 1.4 Browser History (Back / Forward Arrow buttons)
    const tHistory = Date.now();
    try {
      await page.goto(`${BASE_URL}/#about`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('text=35+ Years of Trusted', { timeout: 4000 });
      await page.goto(`${BASE_URL}/#products`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.product-card-item', { timeout: 4000 });
      
      await page.goBack();
      await page.waitForTimeout(500);
      if (!page.url().includes('#about')) throw new Error(`Back button failed: expected #about, got ${page.url()}`);
      
      await page.goForward();
      await page.waitForTimeout(500);
      if (!page.url().includes('#products')) throw new Error(`Forward button failed: expected #products, got ${page.url()}`);

      reporter.record({
        id: 'NAV-HISTORY',
        module: 'Navigation',
        name: 'Browser History Navigation (Back / Forward synchronization)',
        status: 'PASS',
        durationMs: Date.now() - tHistory
      });
    } catch (err) {
      reporter.record({
        id: 'NAV-HISTORY',
        module: 'Navigation',
        name: 'Browser History Navigation (Back / Forward synchronization)',
        status: 'FAIL',
        durationMs: Date.now() - tHistory,
        error: err
      });
    }

    // 1.5 Floating WhatsApp Button
    const tWa = Date.now();
    try {
      const waButton = page.locator('a[href*="wa.me"], a[href*="whatsapp"]').first();
      const isVisible = await waButton.isVisible();
      if (!isVisible) throw new Error('WhatsApp button is not visible on page');
      const href = await waButton.getAttribute('href');
      if (!href || !href.includes('wa.me/')) throw new Error(`WhatsApp href invalid: ${href}`);
      reporter.record({
        id: 'NAV-WHATSAPP',
        module: 'Navigation',
        name: 'Floating WhatsApp CTA Button verification',
        status: 'PASS',
        durationMs: Date.now() - tWa,
        details: `Verified link: ${href}`
      });
    } catch (err) {
      reporter.record({
        id: 'NAV-WHATSAPP',
        module: 'Navigation',
        name: 'Floating WhatsApp CTA Button verification',
        status: 'FAIL',
        durationMs: Date.now() - tWa,
        error: err
      });
    }

    // 1.6 Direct URL access to #admin and /admin
    const tAdminUrl = Date.now();
    try {
      await page.goto(`${BASE_URL}/#admin`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('text=Lookman Admin', { timeout: 4000 });
      const shot = await captureScreenshot('nav_admin_direct_url');
      reporter.record({
        id: 'NAV-ADMIN-URL',
        module: 'Navigation',
        name: 'Direct URL routing to Admin Portal (/#admin)',
        status: 'PASS',
        durationMs: Date.now() - tAdminUrl,
        screenshot: shot
      });
    } catch (err) {
      reporter.record({
        id: 'NAV-ADMIN-URL',
        module: 'Navigation',
        name: 'Direct URL routing to Admin Portal (/#admin)',
        status: 'FAIL',
        durationMs: Date.now() - tAdminUrl,
        error: err
      });
    }

  } finally {
    await ctx.close();
  }
}

module.exports = { runNavigationTests };
