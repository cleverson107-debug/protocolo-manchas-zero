import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const htmlPath = resolve('dist/server/prerendered-routes/index.html');
const workerPath = resolve('dist/server/index.js');
const original = await readFile(htmlPath, 'utf8');

// The page has no React client components. CSS and offer-tracking.js provide
// every browser interaction, so the hydration runtime is unused overhead.
const optimized = original
  .replace(/<link\b[^>]*rel="modulepreload"[^>]*href="\/_next\/static\/chunks\/[^">]+"[^>]*\/?>(?:<\/link>)?/gi, '')
  .replace(/<script\b[^>]*src="\/_next\/static\/chunks\/[^">]+"[^>]*><\/script>/gi, '');

if (optimized === original) {
  throw new Error('Static HTML optimizer did not find the expected framework assets.');
}

await writeFile(htmlPath, optimized);
console.log(`Static HTML optimized: ${original.length - optimized.length} bytes removed.`);

const worker = await readFile(workerPath, 'utf8');
const exportPattern = /var ([A-Za-z_$][\w$]*)=([A-Za-z_$][\w$]*)\?\?\{\};export\{\1 as default\};\s*$/;
const match = worker.match(exportPattern);
if (!match) throw new Error('Could not find the Worker default export.');

const workerWithStaticLanding = worker.replace(exportPattern, `var $1=$2??{};
const __staticLanding={async fetch(request,env,ctx){const response=await $1.fetch(request,env,ctx);const type=response.headers.get('content-type')||'';if(request.method==='GET'&&new URL(request.url).pathname==='/'&&type.includes('text/html'))return new HTMLRewriter().on('script[src^="/_next/static/chunks/"]',{element(element){element.remove()}}).on('link[rel="modulepreload"][href^="/_next/static/chunks/"]',{element(element){element.remove()}}).transform(response);return response}};export{__staticLanding as default};`);
await writeFile(workerPath, workerWithStaticLanding);
console.log('Worker HTML streaming optimization enabled.');
