// src/lib/openAsURL.js
import { buildStandaloneHTML } from './buildStandaloneHTML.js';

export const openQuoteAsURL = async (quote) => {
  const { html, imageFailures } = await buildStandaloneHTML(quote);
  if (!html) return;
  if (imageFailures > 0) {
    console.warn(`[openQuoteAsURL] failed to embed ${imageFailures} images`);
  }
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  // Note: not revoking URL — the new tab needs it. Browser GC will clean up eventually.
};
