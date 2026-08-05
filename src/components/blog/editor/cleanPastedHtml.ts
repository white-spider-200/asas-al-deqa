/**
 * Strips presentational markup from pasted HTML while keeping structure.
 *
 * Word and Google Docs paste carries fonts, sizes, colours, and wrapper markup
 * that the server sanitiser (server/blog.ts) discards on save. Without this the
 * editor shows formatting that silently disappears once the post is published,
 * so the writer's preview lies about the result.
 *
 * What survives: headings, paragraphs, lists, bold/italic/underline/strike,
 * links, images, blockquotes, code. What goes: inline styles, classes, ids,
 * font tags, and Word's conditional-comment and namespaced junk.
 */

/** Tags that carry no meaning once their styling is gone. */
const UNWRAP_TAGS = ['font', 'span', 'div', 'section', 'article', 'header', 'footer'];

/** Tags that should never survive a paste at all, with their contents. */
const DROP_TAGS = ['style', 'script', 'meta', 'link', 'title', 'head', 'o:p', 'xml'];

export function cleanPastedHtml(html: string): string {
  if (!html) return '';

  let out = html
    // Word wraps chunks in conditional comments containing more markup.
    .replace(/<!--[\s\S]*?-->/g, '')
    // Namespaced Word/Excel elements, e.g. <o:p>, <w:sdt>, <st1:place>.
    .replace(/<\/?[a-z0-9]+:[a-z0-9-]+[^>]*>/gi, '');

  for (const tag of DROP_TAGS) {
    out = out.replace(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, 'gi'), '');
    out = out.replace(new RegExp(`<${tag}\\b[^>]*/?>`, 'gi'), '');
  }

  // Drop every attribute except href/src/alt, which carry meaning.
  out = out.replace(/<([a-z0-9]+)((?:\s[^>]*)?)>/gi, (_match, rawTag: string, attrs: string) => {
    const tag = rawTag.toLowerCase();
    if (!attrs.trim()) return `<${tag}>`;

    const kept: string[] = [];
    if (tag === 'a') {
      const href = attrs.match(/\shref\s*=\s*(['"])(.*?)\1/i)?.[2]?.trim();
      if (href && !/^javascript:/i.test(href)) {
        kept.push(`href="${href.replace(/"/g, '&quot;')}"`);
      }
    }
    if (tag === 'img') {
      const src = attrs.match(/\ssrc\s*=\s*(['"])(.*?)\1/i)?.[2]?.trim();
      const alt = attrs.match(/\salt\s*=\s*(['"])(.*?)\1/i)?.[2] || '';
      if (!src || /^javascript:/i.test(src)) return '';
      kept.push(`src="${src.replace(/"/g, '&quot;')}"`, `alt="${alt.replace(/"/g, '&quot;')}"`);
    }
    return kept.length ? `<${tag} ${kept.join(' ')}>` : `<${tag}>`;
  });

  // Unwrap now-meaningless containers, innermost first.
  for (const tag of UNWRAP_TAGS) {
    const open = new RegExp(`<${tag}>`, 'gi');
    const close = new RegExp(`</${tag}>`, 'gi');
    out = out.replace(open, '').replace(close, '');
  }

  return out.replace(/\s{2,}/g, ' ').trim();
}
