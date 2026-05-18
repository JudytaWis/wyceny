// src/lib/slug.js — URL routing + slugify + ID helpers.

export const slugify = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || ('quote-' + Date.now().toString(36));

export const todayStr = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
};

export const uid = () => 'u-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export const getQuoteFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('quote');
};

export const setQuoteInURL = (slug) => {
  const u = new URL(window.location.href);
  if (slug) u.searchParams.set('quote', slug);
  else u.searchParams.delete('quote');
  window.history.replaceState({}, '', u);
};
