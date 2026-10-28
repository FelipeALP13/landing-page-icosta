import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const workerPath = path.resolve('dist/server/index.js');
const manifestPath = path.resolve('dist/.openai/hosting.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

assert.equal(manifest.project_id, 'appgprj_6ad697dd632c81918ac4ba54163a255c');
assert.equal('static' in manifest, false, 'A publicação Worker não pode manter configuração static.');

const workerModule = await import(`${pathToFileURL(workerPath)}?v=${Date.now()}`);
assert.equal(typeof workerModule.default?.fetch, 'function');

const page = await workerModule.default.fetch(new Request('https://example.test/'));
assert.equal(page.status, 200);
assert.match(page.headers.get('content-type') ?? '', /^text\/html/);
assert.match(page.headers.get('content-security-policy') ?? '', /frame-ancestors 'none'/);
assert.equal(page.headers.get('x-content-type-options'), 'nosniff');
assert.equal(page.headers.get('x-frame-options'), 'DENY');
assert.equal(page.headers.get('permissions-policy')?.includes('camera=()'), true);
assert.match(await page.text(), /ICosta Advocacia/);

const missing = await workerModule.default.fetch(new Request('https://example.test/nao-existe'));
assert.equal(missing.status, 404);
assert.equal(missing.headers.get('x-content-type-options'), 'nosniff');

const blockedMethod = await workerModule.default.fetch(new Request('https://example.test/', { method: 'POST' }));
assert.equal(blockedMethod.status, 405);
assert.equal(blockedMethod.headers.get('allow'), 'GET, HEAD');

console.log('Worker validado: conteúdo, CSP, cabeçalhos, 404 e bloqueio de métodos.');
