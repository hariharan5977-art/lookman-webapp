const { BASE_URL, createBrowserContext } = require('./fixtures');

async function runResponsiveUxTests(reporter) {
  console.log('\n--- MODULE 6: UI/UX Responsive Layout & Visual Integrity Tests ---');

  const viewports = [
    { name: 'Desktop (1440x900)', width: 1440, height: 900, isMobile: false },
    { name: 'Tablet / iPad (768x1024)', width: 768, height: 1024, isMobile: false },
    { name: 'Mobile / iPhone 14 (390x844)', width: 390, height: 844, isMobile: true }
  ];

  for (const vp of viewports) {
    const tVp = Date.now();
    const ctx = await createBrowserContext({ viewport: { width: vp.width, height: vp.height } });
    const { page, captureScreenshot } = ctx;

    try {
      await page.goto(`${BASE_URL}/#home`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(800);

      // Check horizontal overflow (zero horizontal scroll blowout)
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 5;
      });

      if (hasOverflow) {
        throw new Error(`Horizontal layout overflow detected! Document scrollWidth exceeds window width (${vp.width}px)`);
      }

      // Check image load integrity
      const brokenImages = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.filter(img => img.src && !img.complete || img.naturalWidth === 0).map(img => img.src);
      });

      if (brokenImages.length > 0) {
        console.warn(`    ⚠️ Warning: ${brokenImages.length} images failed to render on ${vp.name}`);
      }

      // If mobile, test hamburger menu toggle
      if (vp.isMobile) {
        const hamburgerBtn = page.locator('#mobile-hamburger-btn, button[aria-label*="Menu"], button:has(svg)').first();
        if (await hamburgerBtn.isVisible()) {
          await hamburgerBtn.click();
          await page.waitForTimeout(400);
          const menuOpenShot = await captureScreenshot(`ux_mobile_menu_open_${vp.width}`);
          // Close it again
          await hamburgerBtn.click();
          await page.waitForTimeout(300);
        }
      }

      const shot = await captureScreenshot(`ux_viewport_${vp.name.replace(/[^a-zA-Z0-9]/g, '_')}`);

      reporter.record({
        id: `UX-VIEWPORT-${vp.width}`,
        module: 'UI/UX Responsiveness',
        name: `Responsive layout integrity on ${vp.name}`,
        status: 'PASS',
        durationMs: Date.now() - tVp,
        details: `Zero horizontal overflow. Broken images: ${brokenImages.length}`,
        screenshot: shot
      });
    } catch (err) {
      reporter.record({
        id: `UX-VIEWPORT-${vp.width}`,
        module: 'UI/UX Responsiveness',
        name: `Responsive layout integrity on ${vp.name}`,
        status: 'FAIL',
        durationMs: Date.now() - tVp,
        error: err
      });
    } finally {
      await ctx.close();
    }
  }
}

module.exports = { runResponsiveUxTests };
