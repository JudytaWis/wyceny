// vite-plugin-wyceny.js
// Local REST API for quote-app/wyceny/*.json files.
// Dev-only — operates on the filesystem via Node fs.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WYCENY_DIR = path.resolve(__dirname, 'wyceny');
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,99}$/;

async function ensureDir() {
  await fs.mkdir(WYCENY_DIR, { recursive: true });
  await fs.mkdir(PUBLIC_DIR, { recursive: true });
}

function readRawBody(req, max = 20_000_000) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let len = 0;
    let rejected = false;
    req.on('data', (c) => {
      if (rejected) return;
      chunks.push(c);
      len += c.length;
      if (len > max) {
        rejected = true;
        reject(new Error('body too large'));
        req.destroy();
      }
    });
    req.on('end', () => { if (!rejected) resolve(Buffer.concat(chunks).toString('utf8')); });
    req.on('error', (e) => { if (!rejected) reject(e); });
  });
}

function send(res, status, body, contentType = 'application/json; charset=utf-8') {
  res.statusCode = status;
  if (body == null) {
    res.end();
    return;
  }
  res.setHeader('Content-Type', contentType);
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    let rejected = false;
    req.on('data', (chunk) => {
      if (rejected) return;
      raw += chunk;
      if (raw.length > 5_000_000) {
        rejected = true;
        reject(new Error('body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (rejected) return;
      try { resolve(raw ? JSON.parse(raw) : null); } catch (e) { reject(e); }
    });
    req.on('error', (e) => { if (!rejected) reject(e); });
  });
}

export function wycenyPlugin() {
  return {
    name: 'wyceny-plugin',
    configureServer(server) {
      // Create folder once at startup. Per-request mkdir is wasteful and unnecessary.
      ensureDir().catch((err) => console.error('[wyceny-plugin] failed to create wyceny/ dir:', err));

      // Publish API — writes/removes standalone HTML in quote-app/public/<slug>/index.html
      server.middlewares.use('/api/publish', async (req, res, next) => {
        try {
          const url = new URL(req.url, 'http://localhost');
          const parts = url.pathname.split('/').filter(Boolean);
          const slug = parts[0];
          if (!slug || !SLUG_RE.test(slug)) return send(res, 400, { error: 'invalid slug' });

          const targetDir = path.join(PUBLIC_DIR, slug);
          const targetFile = path.join(targetDir, 'index.html');

          if (req.method === 'PUT') {
            const html = await readRawBody(req);
            if (!html || typeof html !== 'string' || !html.includes('<html')) {
              return send(res, 400, { error: 'expected non-empty HTML body' });
            }
            await fs.mkdir(targetDir, { recursive: true });
            await fs.writeFile(targetFile, html, 'utf8');
            return send(res, 200, { ok: true, path: `public/${slug}/index.html` });
          }

          if (req.method === 'DELETE') {
            try {
              await fs.rm(targetDir, { recursive: true, force: true });
              return send(res, 200, { ok: true });
            } catch (e) {
              if (e.code === 'ENOENT') return send(res, 404, { error: 'not found' });
              throw e;
            }
          }

          return send(res, 405, { error: 'method not allowed' });
        } catch (err) {
          console.error('[publish]', err);
          return send(res, 500, { error: err.message });
        }
      });

      server.middlewares.use('/api/wyceny', async (req, res, next) => {
        try {
          const url = new URL(req.url, 'http://localhost');
          const parts = url.pathname.split('/').filter(Boolean); // [] for /api/wyceny, ['slug'] for /api/wyceny/slug
          const slug = parts[0];

          // GET /api/wyceny — list slugs
          if (req.method === 'GET' && !slug) {
            const files = await fs.readdir(WYCENY_DIR);
            const slugs = files
              .filter(f => f.endsWith('.json'))
              .map(f => f.replace(/\.json$/, ''));
            return send(res, 200, slugs);
          }

          if (!slug || !SLUG_RE.test(slug)) return send(res, 400, { error: 'invalid slug' });
          const filepath = path.join(WYCENY_DIR, `${slug}.json`);

          if (req.method === 'GET') {
            try {
              const raw = await fs.readFile(filepath, 'utf8');
              return send(res, 200, raw); // already JSON string
            } catch (e) {
              if (e.code === 'ENOENT') return send(res, 404, { error: 'not found' });
              throw e;
            }
          }

          if (req.method === 'PUT') {
            const body = await readJsonBody(req);
            if (!body || typeof body !== 'object') return send(res, 400, { error: 'invalid JSON body' });
            await fs.writeFile(filepath, JSON.stringify(body, null, 2) + '\n', 'utf8');
            return send(res, 204, null);
          }

          if (req.method === 'DELETE') {
            try {
              await fs.unlink(filepath);
              return send(res, 204, null);
            } catch (e) {
              if (e.code === 'ENOENT') return send(res, 404, { error: 'not found' });
              throw e;
            }
          }

          return send(res, 405, { error: 'method not allowed' });
        } catch (err) {
          console.error('[wyceny-plugin]', err);
          return send(res, 500, { error: err.message });
        }
      });
    },
  };
}
