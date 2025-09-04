#!/usr/bin/env node
/**
 * Read Jest/Vitest JSON reports and print a Markdown table with each test's status.
 * Usage: node scripts/format-test-report.js <path-to-json> [title]
 */
const fs = require('fs');
const path = require('path');

const file = process.argv[2];
const title = process.argv[3] || path.basename(file);
if (!file) {
  console.error('Usage: node scripts/format-test-report.js <json> [title]');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(file, 'utf8'));

function asRows() {
  // Jest JSON has testResults; Vitest JSON reporter (default) also exports similar structure
  const results = data.testResults || data.results || [];
  const rows = [];
  for (const suite of results) {
    const suiteName = suite.name || suite.testFilePath || 'suite';
    const assertions = suite.assertionResults || suite.tests || [];
    for (const a of assertions) {
      const name = a.fullName || a.title || `${suiteName}`;
      const status = a.status || a.state || 'unknown';
      const duration = a.duration != null ? `${a.duration}ms` : (a.time != null ? `${a.time}ms` : '');
      rows.push({ suite: suiteName, name, status, duration });
    }
  }
  return rows;
}

const rows = asRows();
console.log(`\n### ${title}\n`);
console.log('| Suite | Test | Status | Duration |');
console.log('|------|------|--------|----------|');
for (const r of rows) {
  console.log(`| ${path.basename(r.suite)} | ${r.name.replace(/\|/g, '\\|')} | ${r.status} | ${r.duration} |`);
}
