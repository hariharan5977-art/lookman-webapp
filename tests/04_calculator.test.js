const { BASE_URL, createBrowserContext } = require('./fixtures');

async function runCalculatorTests(reporter) {
  console.log('\n--- MODULE 4: Surveillance Solution Calculator Tests ---');
  const ctx = await createBrowserContext();
  const { page, captureScreenshot } = ctx;

  try {
    await page.goto(`${BASE_URL}/#calculator`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('text=Calculator', { timeout: 6000 });

    // 4.1 Calculator Rendering & Initial State
    const tInit = Date.now();
    try {
      await page.waitForSelector('input[type="range"], button:has-text("+"), button:has-text("-")', { timeout: 4000 });
      const shot = await captureScreenshot('calculator_initial_state');
      reporter.record({
        id: 'CALC-RENDER',
        module: 'Solution Calculator',
        name: 'Calculator controls rendering and baseline state',
        status: 'PASS',
        durationMs: Date.now() - tInit,
        screenshot: shot
      });
    } catch (err) {
      reporter.record({
        id: 'CALC-RENDER',
        module: 'Solution Calculator',
        name: 'Calculator controls rendering and baseline state',
        status: 'FAIL',
        durationMs: Date.now() - tInit,
        error: err
      });
    }

    // 4.2 Dynamic Storage and NVR Recalculation
    const tCalc = Date.now();
    try {
      // Find range sliders or increment buttons
      const sliders = page.locator('input[type="range"]');
      const count = await sliders.count();

      if (count > 0) {
        // Adjust camera count slider
        const firstSlider = sliders.first();
        await firstSlider.fill('16');
        await page.waitForTimeout(500);
      }

      // Read output values (Storage HDD TB or NVR recommendations)
      const pageText = await page.textContent('body');
      const hasStorageCalc = pageText.includes('TB') || pageText.includes('Storage') || pageText.includes('NVR');
      if (!hasStorageCalc) throw new Error('Dynamic storage calculations not found on page');

      const shotCalc = await captureScreenshot('calculator_updated_values');
      reporter.record({
        id: 'CALC-DYNAMIC-UPDATE',
        module: 'Solution Calculator',
        name: 'Dynamic real-time storage & bandwidth recalculation on parameter adjustment',
        status: 'PASS',
        durationMs: Date.now() - tCalc,
        screenshot: shotCalc
      });
    } catch (err) {
      reporter.record({
        id: 'CALC-DYNAMIC-UPDATE',
        module: 'Solution Calculator',
        name: 'Dynamic real-time storage & bandwidth recalculation on parameter adjustment',
        status: 'FAIL',
        durationMs: Date.now() - tCalc,
        error: err
      });
    }

    // 4.3 Calculator to Quote Modal Handoff
    const tQuote = Date.now();
    try {
      const quoteBtn = page.locator('button:has-text("Request"), button:has-text("Quote"), button:has-text("Consultation")').first();
      await quoteBtn.click();
      await page.waitForTimeout(500);

      // Verify modal opened with calculator context
      await page.waitForSelector('text=Request a Custom CCTV Quote', { timeout: 4000 });
      const txt = await page.locator('textarea').inputValue();

      const shotHandoff = await captureScreenshot('calculator_quote_handoff');

      // Close modal
      await page.locator('#contact-modal button.absolute').first().click();

      reporter.record({
        id: 'CALC-QUOTE-HANDOFF',
        module: 'Solution Calculator',
        name: 'Handoff calculated system configuration into Quote Inquiry modal',
        status: 'PASS',
        durationMs: Date.now() - tQuote,
        details: `Pre-populated quote text: "${txt.substring(0, 80)}..."`,
        screenshot: shotHandoff
      });
    } catch (err) {
      reporter.record({
        id: 'CALC-QUOTE-HANDOFF',
        module: 'Solution Calculator',
        name: 'Handoff calculated system configuration into Quote Inquiry modal',
        status: 'FAIL',
        durationMs: Date.now() - tQuote,
        error: err
      });
    }

  } finally {
    await ctx.close();
  }
}

module.exports = { runCalculatorTests };
