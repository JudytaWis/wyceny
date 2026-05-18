// vite-plugin-wyceny.js
// Local REST API for quote-app/wyceny/*.json files.
// Dev-only — operates on the filesystem via Node fs.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WYCENY_DIR = path.resolve(__dirname, 'wyceny');
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,99}$/;

async function ensureDir() {
  await fs.mkdir(WYCENY_DIR, { recursive: true });
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
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 5_000_000) reject(new Error('body too large'));
    });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : null); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

export function wycenyPlugin() {
  return {
    name: 'wyceny-plugin',
    configureServer(server) {
      server.middlewares.use('/api/wyceny', async (req, res, next) => {
        try {
          await ensureDir();
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
