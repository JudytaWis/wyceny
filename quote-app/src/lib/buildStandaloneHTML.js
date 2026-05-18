// src/lib/buildStandaloneHTML.js
// Snapshots all .doc-page elements + collects all CSS + embeds images as data URLs.
// Used by "Pokaż HTML" to open the quote as a standalone HTML in a new tab.

export const buildStandaloneHTML = async (quote) => {
  const pages = document.querySelectorAll('.doc-page');
  if (pages.length === 0) return { html: '', imageFailures: 0 };

  // 1) Embed images as data URLs
  const srcMap = {};
  let imageFailures = 0;
  for (const img of document.querySelectorAll('.doc-page img')) {
    const src = img.getAttribute('src');
    if (!src || srcMap[src]) continue;
    try {
      const r = await fetch(src);
      if (!r.ok) throw new Error('fetch failed');
      const blob = await r.blob();
      srcMap[src] = await new Promise((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.onerror = () => rej(fr.error);
        fr.readAsDataURL(blob);
      });
    } catch (e) {
      imageFailures++;
      srcMap[src] = src;
    }
  }

  // 2) Clone pages, strip editor-only chrome, swap image srcs
  const pagesHTML = Array.from(pages).map(p => {
    const clone = p.cloneNode(true);
    clone.querySelectorAll('.no-print').forEach(n => n.remove());
    clone.querySelectorAll('img').forEach(img => {
      const s = img.getAttribute('src');
      if (s && srcMap[s]) img.setAttribute('src', srcMap[s]);
    });
    clone.querySelectorAll('[contenteditable]').forEach(n => {
      n.removeAttribute('contenteditable');
      n.removeAttribute('suppresscontenteditablewarning');
    });
    return clone.outerHTML;
  }).join('\n');

  // 3) Collect CSS — inline <style> + linked stylesheets we control
  let css = '';
  for (const s of document.querySelectorAll('style')) css += s.innerHTML + '\n';
  for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('https://')) continue; // external (Google Fonts) — keep as <link>
    try {
      const r = await fetch(href);
      if (r.ok) css += await r.text() + '\n';
    } catch (e) { /* ignore */ }
  }

  const safeTitle = (quote?.meta?.title || 'Offert').replace(/[<>]/g, '');
  const html = '<!DOCTYPE html>\n' +
    '<html lang="sv">\n' +
    '<head>\n' +
    '<meta charset="UTF-8" />\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
    '<title>BODO Offert · ' + safeTitle + '</title>\n' +
    '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">\n' +
    '<style>' + css + '\n' +
    '  body { background: #F3F4F6; padding: 32px 0; font-family: Montserrat, system-ui, sans-serif; }\n' +
    '  @media print { body { padding: 0; background: white; } }\n' +
    '</style>\n' +
    '</head>\n' +
    '<body>\n' +
    pagesHTML + '\n' +
    '</body>\n' +
    '</html>';

  return { html, imageFailures };
};
