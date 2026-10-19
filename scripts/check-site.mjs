import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const references = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
  .map((match) => match[1])
  .filter((reference) => !/^(?:https?:|mailto:|tel:)/.test(reference));
const missing = [...new Set(references.filter((reference) => !fs.existsSync(path.join(root, reference))))];
const report = {
  title: /<title>[^<]+<\/title>/.test(html),
  h1Count: (html.match(/<h1/g) || []).length,
  sectionCount: (html.match(/<section/g) || []).length,
  metaDescription: /name="description"/.test(html),
  structuredData: /application\/ld\+json/.test(html),
  missingLocalAssets: missing,
};

console.log(JSON.stringify(report, null, 2));

if (!report.title || report.h1Count !== 1 || !report.metaDescription || !report.structuredData || missing.length) {
  process.exit(1);
}
