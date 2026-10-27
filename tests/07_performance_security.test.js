const { BASE_URL, API_URL, createBrowserContext } = require('./fixtures');

async function runPerformanceAndSecurityTests(reporter) {
  console.log('\n--- MODULE 7: Performance, Error Monitoring & Security Boundary Tests ---');
  const ctx = await createBrowserContext();
  const { page, consoleErrors, networkFailures, captureScreenshot } = ctx;

  try {
    // 7.1 Page Load Performance Timing
    const tPerf = Date.now();
    try {
      await page.goto(`${BASE_URL}/#home`, { waitUntil: 'load' });
      const timing = await page.evaluate(() => {
        const perf = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: Math.round(perf ? perf.domContentLoadedEventEnd : 0),
          loadComplete: Math.round(perf ? perf.loadEventEnd : 0),
          transferSizeKb: Math.round(perf ? (perf.transferSize / 1024) : 0)
        };
      });

      const shotPerf = await captureScreenshot('perf_homepage_loaded');
      reporter.record({
        id: 'PERF-LOAD-METRICS',
        module: 'Performance & Reliability',
        name: 'Homepage load & DOM ready performance metrics',
        status: 'PASS',
        durationMs: Date.now() - tPerf,
        details: `DOMContentLoaded: ${timing.domContentLoaded}ms, Load Complete: ${timing.loadComplete}ms, Transfer: ${timing.transferSizeKb} KB`,
        screenshot: shotPerf
      });
    } catch (err) {
      reporter.record({
        id: 'PERF-LOAD-METRICS',
        module: 'Performance & Reliability',
        name: 'Homepage load & DOM ready performance metrics',
        status: 'FAIL',
        durationMs: Date.now() - tPerf,
        error: err
      });
    }

    // 7.2 Console Error and Network Health Audit Across All Primary Routes
    const tAudit = Date.now();
    const routesToAudit = ['/#home', '/#products', '/#solutions', '/#brands', '/#about', '/#contact', '/#calculator'];
    const observedErrors = [];
    const observedFailures = [];

    for (const route of routesToAudit) {
      consoleErrors.length = 0;
      networkFailures.length = 0;
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(400);

      if (consoleErrors.length > 0) {
        observedErrors.push({ route, errors: [...consoleErrors] });
      }
      if (networkFailures.length > 0) {
        observedFailures.push({ route, failures: [...networkFailures] });
      }
    }

    const hasCriticalErrors = observedErrors.some(e => e.errors.some(msg => !msg.includes('favicon') && !msg.includes('CORS')));
    reporter.record({
      id: 'SEC-CONSOLE-NETWORK-AUDIT',
      module: 'Security & Error Handling',
      name: 'Audit browser console errors and failed HTTP network requests across all routes',
      status: hasCriticalErrors ? 'FAIL' : 'PASS',
      durationMs: Date.now() - tAudit,
      details: `Observed console error routes: ${observedErrors.length}, Failed network routes: ${observedFailures.length}`,
      error: hasCriticalErrors ? new Error(JSON.stringify(observedErrors)) : null
    });

    // 7.3 Backend API Security & Unauthorized Route Handling
    const tSecApi = Date.now();
    try {
      // Test GET /api/auth/me without Bearer token -> should return 401 Unauthorized
      const unauthResp = await fetch(`${API_URL}/auth/me`);
      if (unauthResp.status !== 401) {
        throw new Error(`Expected /api/auth/me without token to return 401, got ${unauthResp.status}`);
      }

      // Test POST /api/products without payload -> should return 400 Bad Request
      const badProductResp = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (badProductResp.status !== 400) {
        throw new Error(`Expected /api/products empty body to return 400, got ${badProductResp.status}`);
      }

      reporter.record({
        id: 'SEC-API-BOUNDARY',
        module: 'Security & Error Handling',
        name: 'Backend API security boundary & 401/400 HTTP error code integrity',
        status: 'PASS',
        durationMs: Date.now() - tSecApi,
        details: 'Verified 401 on unauthenticated /api/auth/me and 400 on empty /api/products.'
      });
    } catch (err) {
      reporter.record({
        id: 'SEC-API-BOUNDARY',
        module: 'Security & Error Handling',
        name: 'Backend API security boundary & 401/400 HTTP error code integrity',
        status: 'FAIL',
        durationMs: Date.now() - tSecApi,
        error: err
      });
    }

  } finally {
    await ctx.close();
  }
}

module.exports = { runPerformanceAndSecurityTests };
