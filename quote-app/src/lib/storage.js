// src/lib/storage.js — REST client for /api/wyceny.

const API = '/api/wyceny';

export const storage = {
  async list() {
    const r = await fetch(API);
    if (!r.ok) throw new Error(`list failed: ${r.status}`);
    return r.json();
  },
  async get(slug) {
    const r = await fetch(`${API}/${encodeURIComponent(slug)}`);
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`get(${slug}) failed: ${r.status}`);
    return r.json();
  },
  async put(slug, quote) {
    const r = await fetch(`${API}/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote),
    });
    if (!r.ok) throw new Error(`put(${slug}) failed: ${r.status}`);
  },
  async delete(slug) {
    const r = await fetch(`${API}/${encodeURIComponent(slug)}`, { method: 'DELETE' });
    if (r.status === 404) return;
    if (!r.ok) throw new Error(`delete(${slug}) failed: ${r.status}`);
  },
  async loadAll() {
    const slugs = await this.list();
    const entries = await Promise.all(slugs.map(async (s) => [s, await this.get(s)]));
    const out = {};
    for (const [s, q] of entries) if (q) out[s] = q;
    return out;
  },
};
