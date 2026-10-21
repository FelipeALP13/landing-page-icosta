import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const references = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
  .map((match) => match[1])
  .filter((reference) => !/^(?:https?:|mailto:|tel:)/.test(reference));
const missing = [...new Set(references.filter((reference) => !fs.existsSync(path.join(root, reference))))];
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
const internalFragments = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
const missingFragmentTargets = [...new Set(internalFragments.filter((fragment) => !ids.includes(fragment)))];
const unsafeBlankLinks = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)]
  .map((match) => match[0])
  .filter((anchor) => !/rel="[^"]*noopener[^"]*noreferrer[^"]*"/.test(anchor));
const imagesWithoutAlt = [...html.matchAll(/<img\b[^>]*>/g)]
  .map((match) => match[0])
  .filter((image) => !/\salt="[^"]*"/.test(image));
const buttonsWithoutType = [...html.matchAll(/<button\b[^>]*>/g)]
  .map((match) => match[0])
  .filter((button) => !/\stype="button"/.test(button));
const marketingRiskPatterns = [
  ['promessa de resultado', /resultado garantido|garantia de resultado|causa ganha/i],
  ['promoção de preço', /consulta gratuita|desconto (?:em|nos) honorários|menor preço/i],
  ['autoengrandecimento', /melhor escritório|número 1|o mais premiado/i],
];
const marketingRiskClaims = marketingRiskPatterns
  .filter(([, pattern]) => pattern.test(html))
  .map(([label]) => label);
const primaryNavigation = html.match(/<nav[^>]+id="site-nav"[\s\S]*?<\/nav>/)?.[0] ?? '';
const primaryNavigationTargets = [...primaryNavigation.matchAll(/<a[^>]+href="#([^"]+)"/g)]
  .map((match) => match[1]);
const expectedPrimaryNavigationTargets = ['escritorio', 'atuacao', 'mapa-juridico', 'icosta-lente', 'profissionais', 'contato'];
const topOfPage = html.match(/<header[\s\S]*?<\/section>/)?.[0] ?? '';
const topContactLinkCount = (topOfPage.match(/href="#contato"/g) || []).length;
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
  atlasInPrimaryNavigation: /<nav[^>]+id="site-nav"[\s\S]*?<a href="#mapa-juridico">ICosta Atlas<\/a>/.test(html),
  primaryNavigationOrder: JSON.stringify(primaryNavigationTargets) === JSON.stringify(expectedPrimaryNavigationTargets),
  singleTopContactAction: topContactLinkCount === 1,
  heroPrimaryPractice: /class="button button-gold" href="#atuacao">Conheça nossa atuação/.test(html),
  heroSecondaryAtlas: /class="button-quiet" href="#mapa-juridico">Explore o ICosta Atlas/.test(html),
  consistentHeroMonogram: /class="badge-ring"><img src="assets\/monogram\.svg"/.test(html),
  emphasizedHeroMessage: /Uma nova fase\.<br><strong>A mesma responsabilidade\.<\/strong>/.test(html),
  inertAccessPanel: /data-access-panel[^>]*\sinert(?:\s|>)/.test(html),
  headerBackdrop: /class="header-backdrop"/.test(html),
  unresolvedPlaceholders: /Em atualização|serão inseridos|practice-boundary/.test(html),
  missingLocalAssets: missing,
  duplicateIds,
  missingFragmentTargets,
  unsafeBlankLinkCount: unsafeBlankLinks.length,
  imagesWithoutAltCount: imagesWithoutAlt.length,
  buttonsWithoutTypeCount: buttonsWithoutType.length,
  professionalIdentification: /Isilda Maria da Costa e Silva — OAB\/SP 56\.944/.test(html) && /Simone da Costa e Silva — OAB\/SP 259\.760/.test(html),
  informationalAdvertisingNotice: /Publicidade de caráter exclusivamente informativo/.test(html),
  noResultPromiseNotice: /Sem promessa de resultado/.test(html),
  marketingRiskClaims,
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
  !report.atlasInPrimaryNavigation ||
  !report.primaryNavigationOrder ||
  !report.singleTopContactAction ||
  !report.heroPrimaryPractice ||
  !report.heroSecondaryAtlas ||
  !report.consistentHeroMonogram ||
  !report.emphasizedHeroMessage ||
  !report.inertAccessPanel ||
  !report.headerBackdrop ||
  report.unresolvedPlaceholders ||
  missing.length ||
  duplicateIds.length ||
  missingFragmentTargets.length ||
  unsafeBlankLinks.length ||
  imagesWithoutAlt.length ||
  buttonsWithoutType.length ||
  !report.professionalIdentification ||
  !report.informationalAdvertisingNotice ||
  !report.noResultPromiseNotice ||
  marketingRiskClaims.length
) {
  process.exit(1);
}
