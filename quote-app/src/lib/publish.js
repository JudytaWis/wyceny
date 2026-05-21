// src/lib/publish.js
import { buildStandaloneHTML } from './buildStandaloneHTML.js';

export const PUBLISHED_BASE_URL = 'https://wyceny.vercel.app';
export const DEPLOY_CWD = '/Users/judytawis/Documents/BodoOffice';
export const DEPLOY_COMMAND = `cd ${DEPLOY_CWD} && vercel --prod`;

export const publishedUrlFor = (slug) => `${PUBLISHED_BASE_URL}/${slug}/`;

export const publishHTML = async (quote) => {
  const { html, imageFailures } = await buildStandaloneHTML(quote);
  if (!html) throw new Error('Brak treści wyceny do publikacji.');
  const slug = quote.meta.slug;
  const res = await fetch(`/api/publish/${encodeURIComponent(slug)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'text/html;charset=utf-8' },
    body: html,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Publikacja nie powiodła się (HTTP ${res.status}).`);
  }
  return { imageFailures, url: publishedUrlFor(slug) };
};

export const unpublishHTML = async (slug) => {
  const res = await fetch(`/api/publish/${encodeURIComponent(slug)}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 404) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Usunięcie publikacji nie powiodło się (HTTP ${res.status}).`);
  }
  return true;
};
