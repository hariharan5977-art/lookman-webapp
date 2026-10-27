const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const SCREENSHOTS_DIR = path.join(__dirname, '../qa_artifacts/screenshots');

class TestReporter {
  constructor() {
    this.results = [];
  }

  record({ id, module, name, status, durationMs, error = null, screenshot = null, details = null }) {
    const entry = {
      id,
      module,
      name,
      status, // 'PASS' | 'FAIL' | 'BLOCKED'
      durationMs,
      error: error ? (error.message || String(error)) : null,
      screenshot,
      details,
      timestamp: new Date().toISOString()
    };
    this.results.push(entry);
    const badge = status === 'PASS' ? '✅ PASS' : status === 'FAIL' ? '❌ FAIL' : '⚠️ BLOCKED';
    console.log(`  [${badge}] ${module} -> ${name} (${durationMs}ms)`);
    if (error) {
      console.error(`      Error: ${error.message || error}`);
    }
    return entry;
  }

  summary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const blocked = this.results.filter(r => r.status === 'BLOCKED').length;
    return { total, passed, failed, blocked, results: this.results };
  }
}

async function createBrowserContext(options = {}) {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: options.headless !== false
  });

  const context = await browser.newContext({
    viewport: options.viewport || { width: 1440, height: 900 },
    userAgent: options.userAgent || undefined
  });

  const page = await context.newPage();
  const consoleErrors = [];
  const networkFailures = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('requestfailed', req => {
    networkFailures.push({
      url: req.url(),
      method: req.method(),
      failure: req.failure() ? req.failure().errorText : 'unknown'
    });
  });

  page.on('response', resp => {
    if (resp.status() >= 400 && !resp.url().includes('favicon')) {
      networkFailures.push({
        url: resp.url(),
        status: resp.status(),
        statusText: resp.statusText()
      });
    }
  });

  const captureScreenshot = async (name) => {
    const filename = `${name.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.png`;
    const filepath = path.join(SCREENSHOTS_DIR, filename);
    await page.screenshot({ path: filepath, fullPage: options.fullPage !== false });
    return filename;
  };

  return {
    browser,
    context,
    page,
    consoleErrors,
    networkFailures,
    captureScreenshot,
    close: async () => {
      await context.close();
      await browser.close();
    }
  };
}

module.exports = {
  BASE_URL,
  API_URL,
  SCREENSHOTS_DIR,
  TestReporter,
  createBrowserContext
};
