const { BASE_URL, API_URL, createBrowserContext } = require('./fixtures');

async function runInquiryAndFormTests(reporter) {
  console.log('\n--- MODULE 3: Inquiries, Forms & Validation Tests ---');
  const ctx = await createBrowserContext();
  const { page, captureScreenshot } = ctx;

  try {
    await page.goto(`${BASE_URL}/#contact`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('form', { timeout: 6000 });

    // 3.1 Form Validation: Empty submission rejection
    const tVal = Date.now();
    try {
      const submitBtn = page.locator('form button[type="submit"]').first();
      await submitBtn.click();
      await page.waitForTimeout(400);

      // Verify that form was not submitted (name input has :invalid or required validation)
      const nameInput = page.locator('form input[type="text"]').first();
      const isInvalid = await nameInput.evaluate(el => !el.checkValidity());
      if (!isInvalid) throw new Error('Form allowed submission with empty name field');

      reporter.record({
        id: 'FORM-EMPTY-VALIDATION',
        module: 'Inquiries & Forms',
        name: 'Client-side required field validation on empty submit',
        status: 'PASS',
        durationMs: Date.now() - tVal
      });
    } catch (err) {
      reporter.record({
        id: 'FORM-EMPTY-VALIDATION',
        module: 'Inquiries & Forms',
        name: 'Client-side required field validation on empty submit',
        status: 'FAIL',
        durationMs: Date.now() - tVal,
        error: err
      });
    }

    // 3.2 Valid Form Submission & Backend DB Persistence
    const tSubmit = Date.now();
    const testTimestamp = Date.now();
    const testName = `QA Ramesh ${testTimestamp}`;
    const testEmail = `qa.${testTimestamp}@lookmantest.com`;
    const testPhone = '9841022204';
    const testCity = 'Chennai CIT Nagar';
    const testMessage = `[QA-AUTO-TEST] Verified contact inquiry payload. Timestamp: ${testTimestamp}`;

    try {
      await page.locator('form input[type="text"]').first().fill(testName);
      await page.locator('form input[type="tel"]').first().fill(testPhone);
      await page.locator('form input[type="email"]').first().fill(testEmail);
      
      const textInputs = page.locator('form input[type="text"]');
      if (await textInputs.count() > 1) {
        await textInputs.nth(1).fill(testCity);
      }
      
      await page.locator('form textarea').first().fill(testMessage);

      const shotBefore = await captureScreenshot('form_filled_ready');
      await page.locator('form button[type="submit"]').first().click();

      // Wait for success notice
      await page.waitForSelector('text=Thank You! Your Inquiry Has Been Received', { timeout: 6000 });
      const shotAfter = await captureScreenshot('form_submitted_success');

      // Verify directly with backend API that inquiry persisted
      const apiResp = await fetch(`${API_URL}/inquiries`);
      const apiJson = await apiResp.json();
      const foundInquiry = apiJson.inquiries.find(i => i.email === testEmail || i.name === testName);

      if (!foundInquiry) {
        throw new Error('Submitted inquiry was not found in backend /api/inquiries');
      }

      reporter.record({
        id: 'FORM-SUBMIT-PERSISTENCE',
        module: 'Inquiries & Forms',
        name: 'Valid contact inquiry submission and backend DB persistence',
        status: 'PASS',
        durationMs: Date.now() - tSubmit,
        details: `Verified saved in DB ID: ${foundInquiry.id}, Name: ${foundInquiry.name}`,
        screenshot: shotAfter
      });
    } catch (err) {
      reporter.record({
        id: 'FORM-SUBMIT-PERSISTENCE',
        module: 'Inquiries & Forms',
        name: 'Valid contact inquiry submission and backend DB persistence',
        status: 'FAIL',
        durationMs: Date.now() - tSubmit,
        error: err
      });
    }

    // 3.3 Security: Input Sanitization & XSS Resistance
    const tSec = Date.now();
    try {
      const xssPayload = '<script>alert("XSS")</script><img src=x onerror=alert(1)>';
      await page.goto(`${BASE_URL}/#home`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(300);
      await page.goto(`${BASE_URL}/#contact`, { waitUntil: 'domcontentloaded' });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('form', { timeout: 6000 });

      let dialogTriggered = false;
      page.on('dialog', async d => {
        dialogTriggered = true;
        await d.dismiss();
      });

      await page.locator('form input[type="text"]').first().fill(xssPayload);
      await page.locator('form input[type="tel"]').first().fill('9840012345');
      await page.locator('form input[type="email"]').first().fill(`xss.${Date.now()}@test.com`);
      await page.locator('form textarea').first().fill(xssPayload);
      await page.locator('form button[type="submit"]').first().click();
      await page.waitForTimeout(1000);

      if (dialogTriggered) {
        throw new Error('SECURITY VULNERABILITY: Stored or reflected XSS triggered browser alert dialog!');
      }

      reporter.record({
        id: 'FORM-XSS-RESISTANCE',
        module: 'Security & Error Handling',
        name: 'XSS Injection Payload Resistance in Inquiry Forms',
        status: 'PASS',
        durationMs: Date.now() - tSec,
        details: 'Zero alert dialogs triggered, input safely treated as text.'
      });
    } catch (err) {
      reporter.record({
        id: 'FORM-XSS-RESISTANCE',
        module: 'Security & Error Handling',
        name: 'XSS Injection Payload Resistance in Inquiry Forms',
        status: 'FAIL',
        durationMs: Date.now() - tSec,
        error: err
      });
    }

  } finally {
    await ctx.close();
  }
}

module.exports = { runInquiryAndFormTests };
