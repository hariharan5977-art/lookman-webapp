const { BASE_URL, createBrowserContext } = require('./fixtures');

async function runCatalogTests(reporter) {
  console.log('\n--- MODULE 2: Product Catalog & Detail View Tests ---');
  const ctx = await createBrowserContext();
  const { page, captureScreenshot } = ctx;

  try {
    await page.goto(`${BASE_URL}/#products?category=all`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.product-card-item', { timeout: 6000 });

    // 2.1 Category Filtering
    const tCategory = Date.now();
    try {
      const initialCardsCount = await page.locator('.product-card-item').count();
      if (initialCardsCount === 0) throw new Error('No products rendered in initial catalog grid');

      // Click "IP Camera" or "HD Analog" tab
      const catTab = page.locator('button:has-text("HD IP"), button:has-text("IP Camera"), button:has-text("HD Camera")').first();
      await catTab.click();
      await page.waitForTimeout(500);
      const filteredCardsCount = await page.locator('.product-card-item').count();
      const shot = await captureScreenshot('catalog_category_filter');

      reporter.record({
        id: 'CAT-CATEGORY-FILTER',
        module: 'Catalog',
        name: 'Filter products by category tab',
        status: 'PASS',
        durationMs: Date.now() - tCategory,
        details: `Initial: ${initialCardsCount} products, Filtered: ${filteredCardsCount} products`,
        screenshot: shot
      });
    } catch (err) {
      reporter.record({
        id: 'CAT-CATEGORY-FILTER',
        module: 'Catalog',
        name: 'Filter products by category tab',
        status: 'FAIL',
        durationMs: Date.now() - tCategory,
        error: err
      });
    }

    // 2.2 Deep Linking / Direct Model URL Routing
    const tDeepLink = Date.now();
    try {
      await page.goto(`${BASE_URL}/#products?category=All&model=CO-H-2DFDML(V)`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('text=Product Code:', { timeout: 6000 });
      await page.waitForSelector('text=KEY FEATURES', { timeout: 6000 });
      const shot = await captureScreenshot('catalog_deeplink_model');

      reporter.record({
        id: 'CAT-DEEPLINK-MODEL',
        module: 'Catalog',
        name: 'Direct URL deep linking to specific camera model specification',
        status: 'PASS',
        durationMs: Date.now() - tDeepLink,
        screenshot: shot
      });
    } catch (err) {
      reporter.record({
        id: 'CAT-DEEPLINK-MODEL',
        module: 'Catalog',
        name: 'Direct URL deep linking to specific camera model specification',
        status: 'FAIL',
        durationMs: Date.now() - tDeepLink,
        error: err
      });
    }

    // 2.3 Product Detail Modal Showcase and Quote Modal Trigger
    const tDetail = Date.now();
    try {
      await page.goto(`${BASE_URL}/#products?category=all`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.product-card-item', { timeout: 5000 });
      const firstCard = page.locator('.product-card-item').first();
      await firstCard.click();
      await page.waitForTimeout(600);

      // Check modal content: Product Code, Specifications, Request Quote
      await page.waitForSelector('text=Product Code:', { timeout: 4000 });
      await page.waitForSelector('text=KEY FEATURES', { timeout: 4000 });

      const quoteBtn = page.locator('button:has-text("Request Quote")').first();
      const hasRequestQuote = await quoteBtn.isVisible();
      if (!hasRequestQuote) throw new Error('Request Quote CTA button missing from product detail modal');

      const shotModal = await captureScreenshot('catalog_product_detail_modal');

      // Click Request Quote to check modal handoff
      await quoteBtn.click();
      await page.waitForTimeout(500);

      // Verify ContactQuoteModal opened with pre-filled message
      await page.waitForSelector('text=Request a Custom CCTV Quote', { timeout: 4000 });
      const textareaVal = await page.locator('#contact-modal textarea').inputValue();
      if (!textareaVal.toLowerCase().includes('quote request')) {
        throw new Error(`Quote modal not pre-filled with context, value was: "${textareaVal}"`);
      }

      // Close quote modal
      const closeBtn = page.locator('#contact-modal button.absolute').first();
      await closeBtn.click();
      await page.waitForTimeout(400);

      reporter.record({
        id: 'CAT-DETAIL-AND-QUOTE',
        module: 'Catalog',
        name: 'Product detail modal showcase and quote modal context handoff',
        status: 'PASS',
        durationMs: Date.now() - tDetail,
        screenshot: shotModal
      });
    } catch (err) {
      reporter.record({
        id: 'CAT-DETAIL-AND-QUOTE',
        module: 'Catalog',
        name: 'Product detail modal showcase and quote modal context handoff',
        status: 'FAIL',
        durationMs: Date.now() - tDetail,
        error: err
      });
    }

  } finally {
    await ctx.close();
  }
}

module.exports = { runCatalogTests };
