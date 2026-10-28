import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve('.');
const staticRoot = path.join(projectRoot, 'dist');
const outputRoot = path.join(staticRoot, 'server');
const outputFile = path.join(outputRoot, 'index.js');
const builtManifest = path.join(staticRoot, '.openai', 'hosting.json');

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

const excludedTopLevel = new Set(['server', '.openai', '_headers']);
const files = [];

function walk(directory, relative = '') {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!relative && excludedTopLevel.has(entry.name)) continue;
    const entryRelative = path.posix.join(relative, entry.name);
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(entryPath, entryRelative);
    else if (entry.isFile()) files.push(entryRelative);
    else throw new Error(`Unsupported build input: ${entryRelative}`);
  }
}

walk(staticRoot);

const assets = Object.fromEntries(files.sort().map((relative) => {
  const bytes = fs.readFileSync(path.join(staticRoot, relative));
  const pathname = `/${relative}`;
  return [pathname, {
    body: bytes.toString('base64'),
    contentType: mimeTypes[path.extname(relative).toLowerCase()] ?? 'application/octet-stream',
    etag: `"${crypto.createHash('sha256').update(bytes).digest('base64url')}"`,
  }];
}));

const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; base-uri 'none'; object-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; media-src 'none'; frame-src 'none'; frame-ancestors 'none'; worker-src 'none'; manifest-src 'self'; form-action 'none'; upgrade-insecure-requests",
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'X-DNS-Prefetch-Control': 'off',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy': 'accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), usb=(), web-share=()',
  'Strict-Transport-Security': 'max-age=31536000',
};

const workerSource = `const ASSETS = ${JSON.stringify(assets)};
const SECURITY_HEADERS = ${JSON.stringify(securityHeaders)};

function responseHeaders(asset, pathname) {
  return {
    ...SECURITY_HEADERS,
    'Content-Type': asset?.contentType ?? 'text/plain; charset=utf-8',
    'Cache-Control': pathname === '/index.html' || pathname === '/.well-known/security.txt'
      ? 'no-cache'
      : 'public, max-age=3600',
    ...(asset ? { ETag: asset.etag } : {}),
  };
}

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

export default {
  async fetch(request) {
    const method = request.method.toUpperCase();
    if (method !== 'GET' && method !== 'HEAD') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { ...responseHeaders(null, ''), Allow: 'GET, HEAD' },
      });
    }

    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url).pathname); }
    catch { return new Response('Bad request', { status: 400, headers: responseHeaders(null, '') }); }
    if (pathname === '/') pathname = '/index.html';
    const asset = ASSETS[pathname];
    if (!asset) return new Response('Not found', { status: 404, headers: responseHeaders(null, pathname) });

    const headers = responseHeaders(asset, pathname);
    if (request.headers.get('If-None-Match') === asset.etag) {
      return new Response(null, { status: 304, headers });
    }
    return new Response(method === 'HEAD' ? null : decodeBase64(asset.body), { status: 200, headers });
  },
};
`;

fs.mkdirSync(outputRoot, { recursive: true });
fs.mkdirSync(path.dirname(builtManifest), { recursive: true });
fs.writeFileSync(outputFile, workerSource);
fs.copyFileSync(path.join(projectRoot, '.openai', 'hosting.json'), builtManifest);
console.log(`Worker gerado com ${files.length} recursos e ${Buffer.byteLength(workerSource)} bytes.`);
