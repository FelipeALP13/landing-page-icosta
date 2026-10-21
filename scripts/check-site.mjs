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
  heroAreaCount: (html.match(/data-hero-area/g) || []).length,
  atlasAreaCount: (html.match(/data-atlas-area=/g) || []).length,
  lensAreaCount: (html.match(/data-lens-document=/g) || []).length,
  professionalPhoto: /assets\/isilda-maria-da-costa-e-silva\.webp/.test(html),
  socialImage: /property="og:image"/.test(html),
  twitterCard: /name="twitter:card"/.test(html),
  openingHours: /"opens": "08:00"/.test(html) && /"closes": "17:30"/.test(html),
  familyStory: /Mãe e filha, Isilda e Simone/.test(html),
  inertAccessPanel: /data-access-panel[^>]*\sinert(?:\s|>)/.test(html),
  headerBackdrop: /class="header-backdrop"/.test(html),
  unresolvedPlaceholders: /Em atualização|serão inseridos|practice-boundary/.test(html),
  missingLocalAssets: missing,
};

console.log(JSON.stringify(report, null, 2));

if (
  !report.title ||
  report.h1Count !== 1 ||
  !report.metaDescription ||
  !report.structuredData ||
  report.heroAreaCount !== 6 ||
  report.atlasAreaCount !== 6 ||
  report.lensAreaCount !== 6 ||
  !report.professionalPhoto ||
  !report.socialImage ||
  !report.twitterCard ||
  !report.openingHours ||
  !report.familyStory ||
  !report.inertAccessPanel ||
  !report.headerBackdrop ||
  report.unresolvedPlaceholders ||
  missing.length
) {
  process.exit(1);
}
