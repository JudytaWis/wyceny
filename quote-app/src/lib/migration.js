// src/lib/migration.js — one-shot import from localStorage.bodo_quotes_v1 to filesystem.

import { storage } from './storage.js';

const LEGACY_KEY = 'bodo_quotes_v1';
const MIGRATION_DONE_KEY = 'bodo_migration_to_files_done_v1';

export async function migrateLocalStorageIfNeeded() {
  if (typeof window === 'undefined') return { migrated: 0, skipped: true };
  if (localStorage.getItem(MIGRATION_DONE_KEY) === '1') return { migrated: 0, skipped: true };

  const raw = localStorage.getItem(LEGACY_KEY);
  if (!raw) {
    localStorage.setItem(MIGRATION_DONE_KEY, '1');
    return { migrated: 0, skipped: true };
  }

  let data;
  try { data = JSON.parse(raw); } catch (e) {
    return { migrated: 0, skipped: true, error: 'invalid JSON in localStorage' };
  }
  if (!data || typeof data !== 'object') return { migrated: 0, skipped: true };

  const existing = await storage.list();
  const existingSet = new Set(existing);

  let migrated = 0;
  for (const [slug, quote] of Object.entries(data)) {
    if (existingSet.has(slug)) continue; // never overwrite existing file
    if (!quote || typeof quote !== 'object') continue;
    await storage.put(slug, quote);
    migrated++;
  }

  localStorage.setItem(MIGRATION_DONE_KEY, '1');
  // intentionally DO NOT clear LEGACY_KEY — leave as belt-and-suspenders backup
  return { migrated, skipped: false };
}
