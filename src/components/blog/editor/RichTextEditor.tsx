import React, { useCallback, useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { blogApi } from '../../../lib/blog-api';
import { adminLabels, type AdminLang } from '../../../lib/admin-i18n';
import { Toolbar } from './Toolbar';
import { EditorStats } from './EditorStats';
import { HEADING_LEVELS, WORDS_PER_MINUTE } from './constants';
import { cleanPastedHtml } from './cleanPastedHtml';

export type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  dir?: 'rtl' | 'ltr';
  className?: string;
  /** Language of the toolbar labels, not of the content. */
  lang?: AdminLang;
};

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your article…',
  dir = 'ltr',
  className,
  lang = 'en',
}: RichTextEditorProps) {
  const t = adminLabels[lang].editor;
  const [stats, setStats] = useState({ words: 0, minutes: 0 });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStats = useCallback((text: string) => {
    const words = countWords(text);
    setStats({ words, minutes: words ? Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)) : 0 });
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [...HEADING_LEVELS] },
        // Link ships with StarterKit v3. Registering it separately would create
        // a duplicate extension name and silently discard these options.
        link: {
          openOnClick: false,
          HTMLAttributes: { class: 'text-primary underline' },
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['paragraph', 'heading'] }),
      Image.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full my-4' } }),
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
      // Strip presentational markup from Word/Docs so the editor shows what the
      // server sanitiser will actually keep.
      transformPastedHTML: cleanPastedHtml,
    },
  });

  // Sync only external resets (loading a post, switching language tab), never
  // the user's own keystrokes — those already flow out through onUpdate.
  useEffect(() => {
    if (!editor) return;
    if (value === editor.getHTML()) return;
    editor.commands.setContent(value || '', { emitUpdate: false });
    updateStats(editor.getText());
  }, [value, editor, updateStats]);

  if (!editor) return null;

  const insertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setError(null);
      setUploading(true);
      try {
        const { url } = await blogApi.upload(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        setError(err instanceof Error ? err.message : t.uploadFailed);
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-outline-variant bg-white',
        className,
      )}
    >
      <Toolbar
        editor={editor}
        t={t}
        lang={lang}
        dir={dir}
        uploading={uploading}
        onInsertImage={insertImage}
      />

      {error && (
        <div
          className="flex items-center justify-between gap-3 border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
          dir={dir}
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            title={t.dismiss}
            aria-label={t.dismiss}
            className="shrink-0 rounded p-1 hover:bg-red-100"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <EditorContent editor={editor} />

      <EditorStats words={stats.words} minutes={stats.minutes} t={t} dir={dir} />
    </div>
  );
}
