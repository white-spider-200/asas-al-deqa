/**
 * The article title is already the page <h1> (see InsightPost), so body headings
 * start at h2. The editor labels them 1/2/3 because that is how a writer thinks
 * about them — the offset is deliberate and keeps one h1 per page.
 *
 * previewSize is the font size used to render the option inside the dropdown,
 * so option order and styling are not coupled by index.
 */
export const BLOCK_TYPES = [
  { kind: 'paragraph', labelKey: 'normal', previewSize: 15, weight: 400 },
  { kind: 'heading', level: 2, labelKey: 'h1', previewSize: 20, weight: 800 },
  { kind: 'heading', level: 3, labelKey: 'h2', previewSize: 17, weight: 800 },
  { kind: 'heading', level: 4, labelKey: 'h3', previewSize: 15.5, weight: 800 },
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export const HEADING_LEVELS = [2, 3, 4] as const;

/** Locked to the brand palette so articles stay on-brand. */
export const TEXT_COLOURS = [
  { label: { en: 'Navy', ar: 'كحلي' }, value: '#12212E' },
  { label: { en: 'Brand blue', ar: 'أزرق العلامة' }, value: '#005F93' },
  { label: { en: 'Light blue', ar: 'أزرق فاتح' }, value: '#0B7FB8' },
  { label: { en: 'Grey', ar: 'رمادي' }, value: '#6B7280' },
  { label: { en: 'Amber', ar: 'كهرماني' }, value: '#B45309' },
  { label: { en: 'Red', ar: 'أحمر' }, value: '#B91C1C' },
] as const;

export const HIGHLIGHTS = [
  { label: { en: 'Blue', ar: 'أزرق' }, value: '#E8F3F9' },
  { label: { en: 'Yellow', ar: 'أصفر' }, value: '#FEF3C7' },
  { label: { en: 'Green', ar: 'أخضر' }, value: '#DCFCE7' },
  { label: { en: 'Pink', ar: 'وردي' }, value: '#FCE7F3' },
] as const;

/**
 * Physical values, not logical start/end — TipTap does not support logical
 * alignment. In an RTL article "left" means left, which is what a writer
 * reaching for the button intends. Must stay in sync with SAFE_ALIGN and
 * ALIGNABLE_TAGS in server/blog.ts, or the value is dropped on save.
 */
export const ALIGNMENTS = ['left', 'center', 'right', 'justify'] as const;
export type Alignment = (typeof ALIGNMENTS)[number];

/** Words per minute used for the read-time estimate. */
export const WORDS_PER_MINUTE = 200;
