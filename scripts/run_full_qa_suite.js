const fs = require('fs');
const path = require('path');
const { TestReporter } = require('../tests/fixtures');
const { runNavigationTests } = require('../tests/01_navigation.test');
const { runCatalogTests } = require('../tests/02_catalog.test');
const { runInquiryAndFormTests } = require('../tests/03_inquiries_and_forms.test');
const { runCalculatorTests } = require('../tests/04_calculator.test');
const { runAdminPortalTests } = require('../tests/05_admin_portal.test');
const { runResponsiveUxTests } = require('../tests/06_responsive_ux.test');
const { runPerformanceAndSecurityTests } = require('../tests/07_performance_security.test');

(async () => {
  console.log('======================================================================');
  console.log('  LOOKMAN FULL-STACK APPLICATION QA AUTOMATION TEST SUITE EXECUTION   ');
  console.log('======================================================================');
  const startTime = Date.now();
  const reporter = new TestReporter();

  try {
    await runNavigationTests(reporter);
    await runCatalogTests(reporter);
    await runInquiryAndFormTests(reporter);
    await runCalculatorTests(reporter);
    await runAdminPortalTests(reporter);
    await runResponsiveUxTests(reporter);
    await runPerformanceAndSecurityTests(reporter);
  } catch (fatalErr) {
    console.error('FATAL SUITE EXECUTION ERROR:', fatalErr);
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  const summary = reporter.summary();

  console.log('\n======================================================================');
  console.log(`  QA TEST EXECUTION COMPLETED IN ${durationSec}s`);
  console.log(`  TOTAL: ${summary.total} | PASSED: ${summary.passed} | FAILED: ${summary.failed} | BLOCKED: ${summary.blocked}`);
  console.log('======================================================================\n');

  // Save JSON report
  const reportPath = path.join(__dirname, '../qa_artifacts/qa_test_report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    executionTime: new Date().toISOString(),
    durationSeconds: parseFloat(durationSec),
    ...summary
  }, null, 2));

  console.log(`Full report saved to: ${reportPath}`);
  process.exit(summary.failed > 0 ? 1 : 0);
})();
