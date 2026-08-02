import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import {
  Bold,
  Check,
  ChevronDown,
  Highlighter,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Palette,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { blogApi } from '../../lib/blog-api';

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  dir?: 'rtl' | 'ltr';
  className?: string;
  /** Language of the toolbar labels, not of the content. */
  lang?: 'ar' | 'en';
};

const LABELS = {
  en: {
    normal: 'Normal text',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    blockType: 'Text style',
    bold: 'Bold',
    italic: 'Italic',
    strike: 'Strikethrough',
    bullet: 'Bullet list',
    ordered: 'Numbered list',
    quote: 'Quote',
    rule: 'Divider',
    link: 'Link',
    image: 'Insert image',
    undo: 'Undo',
    redo: 'Redo',
    colour: 'Text colour',
    highlight: 'Highlight',
    none: 'Default',
    linkPrompt: 'Link URL',
    uploadFailed: 'Upload failed',
    words: 'words',
    readTime: 'min read',
    hint: 'Tip: type ## then a space for a heading, or - then a space for a list.',
  },
  ar: {
    normal: 'نص عادي',
    h1: 'عنوان ١',
    h2: 'عنوان ٢',
    h3: 'عنوان ٣',
    blockType: 'نمط النص',
    bold: 'عريض',
    italic: 'مائل',
    strike: 'يتوسطه خط',
    bullet: 'قائمة نقطية',
    ordered: 'قائمة مرقمة',
    quote: 'اقتباس',
    rule: 'فاصل',
    link: 'رابط',
    image: 'إدراج صورة',
    undo: 'تراجع',
    redo: 'إعادة',
    colour: 'لون النص',
    highlight: 'تظليل',
    none: 'الافتراضي',
    linkPrompt: 'رابط URL',
    uploadFailed: 'فشل رفع الصورة',
    words: 'كلمة',
    readTime: 'دقيقة قراءة',
    hint: 'تلميح: اكتب ## ثم مسافة لإنشاء عنوان، أو - ثم مسافة لإنشاء قائمة.',
  },
} as const;

/**
 * The article title is already the page <h1> (see InsightPost), so body headings
 * start at h2. The editor labels them 1/2/3 because that is how a writer thinks
 * about them.
 */
const HEADING_LEVELS = [2, 3, 4] as const;

/** Locked to the brand palette so articles stay on-brand. */
const TEXT_COLOURS = [
  { label: { en: 'Navy', ar: 'كحلي' }, value: '#12212E' },
  { label: { en: 'Brand blue', ar: 'أزرق العلامة' }, value: '#005F93' },
  { label: { en: 'Light blue', ar: 'أزرق فاتح' }, value: '#0B7FB8' },
  { label: { en: 'Grey', ar: 'رمادي' }, value: '#6B7280' },
  { label: { en: 'Amber', ar: 'كهرماني' }, value: '#B45309' },
  { label: { en: 'Red', ar: 'أحمر' }, value: '#B91C1C' },
] as const;

const HIGHLIGHTS = [
  { label: { en: 'Blue', ar: 'أزرق' }, value: '#E8F3F9' },
  { label: { en: 'Yellow', ar: 'أصفر' }, value: '#FEF3C7' },
  { label: { en: 'Green', ar: 'أخضر' }, value: '#DCFCE7' },
  { label: { en: 'Pink', ar: 'وردي' }, value: '#FCE7F3' },
] as const;

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors',
        active ? 'bg-primary text-white' : 'text-on-surface hover:bg-surface-container',
      )}
    >
      {children}
    </button>
  );
}

/** Closes the popover when the user clicks anywhere outside it. */
function useClickOutside(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', esc);
    };
  }, [onClose]);
  return ref;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your article…',
  dir = 'ltr',
  className,
  lang = 'en',
}: RichTextEditorProps) {
  const t = LABELS[lang];
  const [blockMenuOpen, setBlockMenuOpen] = useState(false);
  const [colourMenuOpen, setColourMenuOpen] = useState(false);
  const [stats, setStats] = useState({ words: 0, minutes: 0 });

  const blockRef = useClickOutside(() => setBlockMenuOpen(false));
  const colourRef = useClickOutside(() => setColourMenuOpen(false));

  const updateStats = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    setStats({ words, minutes: words ? Math.max(1, Math.ceil(words / 200)) : 0 });
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [...HEADING_LEVELS] },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-lg max-w-full my-4' },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
      updateStats(ed.getText());
    },
    onCreate: ({ editor: ed }) => updateStats(ed.getText()),
    editorProps: {
      attributes: {
        // article-content is the same stylesheet the live post page uses, so what
        // you type here is what gets published.
        class: 'article-content min-h-[320px] px-6 py-5 focus:outline-none',
        dir,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && value !== editor.getText()) {
      // Only sync external resets (language switch / load), not every keystroke
      if (value !== current) {
        editor.commands.setContent(value || '', { emitUpdate: false });
        updateStats(editor.getText());
      }
    }
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt(t.linkPrompt, previous || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const { url } = await blogApi.upload(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        window.alert(err instanceof Error ? err.message : t.uploadFailed);
      }
    };
    input.click();
  };

  const blockOptions = [
    { label: t.normal, isActive: editor.isActive('paragraph') && !editor.isActive('heading'), apply: () => editor.chain().focus().setParagraph().run() },
    ...HEADING_LEVELS.map((level, i) => ({
      label: [t.h1, t.h2, t.h3][i],
      isActive: editor.isActive('heading', { level }),
      apply: () => editor.chain().focus().setHeading({ level }).run(),
    })),
  ];

  const currentBlock = blockOptions.find((o) => o.isActive)?.label ?? t.normal;
  const activeColour = (editor.getAttributes('textStyle').color as string | undefined) || null;

  return (
    <div className={cn('overflow-hidden rounded-xl border border-outline-variant bg-white', className)}>
      <div
        className="sticky top-[73px] z-[5] flex flex-wrap items-center gap-1 border-b border-outline-variant bg-background px-2 py-2"
        dir={dir}
      >
        {/* Block type dropdown */}
        <div className="relative" ref={blockRef}>
          <button
            type="button"
            title={t.blockType}
            onClick={() => setBlockMenuOpen((v) => !v)}
            className="inline-flex h-8 min-w-[8.5rem] items-center justify-between gap-2 rounded-md border border-outline-variant bg-white px-2.5 text-sm font-medium text-on-surface hover:bg-surface-container"
          >
            <span className="truncate">{currentBlock}</span>
            <ChevronDown size={14} className="shrink-0 opacity-60" />
          </button>
          {blockMenuOpen && (
            <div
              className="absolute z-20 mt-1 min-w-[11rem] overflow-hidden rounded-lg border border-outline-variant bg-white py-1 shadow-lg"
              style={dir === 'rtl' ? { right: 0 } : { left: 0 }}
            >
              {blockOptions.map((opt, i) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => {
                    opt.apply();
                    setBlockMenuOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-start hover:bg-surface-container',
                    opt.isActive ? 'text-primary font-bold' : 'text-on-surface',
                  )}
                  style={{
                    fontSize: [15, 20, 17, 15.5][i],
                    fontWeight: i === 0 ? 400 : 800,
                  }}
                >
                  <Check size={14} className={cn('shrink-0', opt.isActive ? 'opacity-100' : 'opacity-0')} />
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mx-1 h-5 w-px bg-outline-variant" />

        <ToolbarButton title={t.bold} active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton title={t.italic} active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton title={t.strike} active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={16} />
        </ToolbarButton>

        {/* Colour + highlight */}
        <div className="relative" ref={colourRef}>
          <button
            type="button"
            title={t.colour}
            onClick={() => setColourMenuOpen((v) => !v)}
            className={cn(
              'inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm transition-colors',
              colourMenuOpen ? 'bg-surface-container' : 'hover:bg-surface-container',
            )}
          >
            <Palette size={16} style={activeColour ? { color: activeColour } : undefined} />
            <ChevronDown size={12} className="opacity-60" />
          </button>
          {colourMenuOpen && (
            <div
              className="absolute z-20 mt-1 w-56 rounded-lg border border-outline-variant bg-white p-3 shadow-lg"
              style={dir === 'rtl' ? { right: 0 } : { left: 0 }}
            >
              <p className="mb-2 text-xs font-bold text-muted">{t.colour}</p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {TEXT_COLOURS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label[lang]}
                    onClick={() => editor.chain().focus().setColor(c.value).run()}
                    className={cn(
                      'h-7 w-7 rounded-md border transition-transform hover:scale-110',
                      activeColour?.toLowerCase() === c.value.toLowerCase()
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-outline-variant',
                    )}
                    style={{ background: c.value }}
                  />
                ))}
                <button
                  type="button"
                  title={t.none}
                  onClick={() => editor.chain().focus().unsetColor().run()}
                  className="inline-flex h-7 items-center rounded-md border border-outline-variant px-2 text-xs font-bold text-muted hover:bg-surface-container"
                >
                  {t.none}
                </button>
              </div>

              <p className="mb-2 text-xs font-bold text-muted">{t.highlight}</p>
              <div className="flex flex-wrap gap-1.5">
                {HIGHLIGHTS.map((h) => (
                  <button
                    key={h.value}
                    type="button"
                    title={h.label[lang]}
                    onClick={() => editor.chain().focus().toggleHighlight({ color: h.value }).run()}
                    className={cn(
                      'h-7 w-7 rounded-md border transition-transform hover:scale-110',
                      editor.isActive('highlight', { color: h.value })
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-outline-variant',
                    )}
                    style={{ background: h.value }}
                  />
                ))}
                <button
                  type="button"
                  title={t.none}
                  onClick={() => editor.chain().focus().unsetHighlight().run()}
                  className="inline-flex h-7 items-center rounded-md border border-outline-variant px-2 text-xs font-bold text-muted hover:bg-surface-container"
                >
                  {t.none}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mx-1 h-5 w-px bg-outline-variant" />

        <ToolbarButton title={t.bullet} active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton title={t.ordered} active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton title={t.quote} active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton title={t.rule} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={16} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-outline-variant" />

        <ToolbarButton title={t.link} active={editor.isActive('link')} onClick={setLink}>
          <Link2 size={16} />
        </ToolbarButton>
        <ToolbarButton title={t.image} onClick={addImage}>
          <ImageIcon size={16} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-outline-variant" />

        <ToolbarButton title={t.undo} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton title={t.redo} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={16} />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      <div
        className="flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant bg-background px-4 py-2 text-xs text-muted"
        dir={dir}
      >
        <span>{t.hint}</span>
        <span className="font-medium whitespace-nowrap">
          {stats.words} {t.words}
          {stats.minutes > 0 && ` · ${stats.minutes} ${t.readTime}`}
        </span>
      </div>
    </div>
  );
}
