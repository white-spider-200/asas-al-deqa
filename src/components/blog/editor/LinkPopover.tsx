import React, { useCallback, useEffect, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { Link2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { EditorLabels } from '../../../lib/admin-i18n';
import { useClickOutside } from './useClickOutside';

type LinkPopoverProps = {
  editor: Editor;
  t: EditorLabels;
  dir: 'rtl' | 'ltr';
};

/** Inline link editor. Replaces window.prompt, which cannot be styled or localised. */
export function LinkPopover({ editor, t, dir }: LinkPopoverProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside(close);

  const isActive = editor.isActive('link');

  useEffect(() => {
    if (open) {
      setUrl((editor.getAttributes('link').href as string | undefined) || 'https://');
    }
  }, [open, editor]);

  const apply = () => {
    const value = url.trim();
    if (!value || value === 'https://') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: value }).run();
    }
    close();
  };

  const remove = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    close();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        title={t.link}
        aria-label={t.link}
        aria-pressed={isActive}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors',
          isActive ? 'bg-primary text-white' : 'text-on-surface hover:bg-surface-container',
        )}
      >
        <Link2 size={16} />
      </button>

      {open && (
        <div
          className="absolute z-20 mt-1 w-72 rounded-lg border border-outline-variant bg-white p-3 shadow-lg"
          style={dir === 'rtl' ? { right: 0 } : { left: 0 }}
        >
          <label className="mb-1.5 block text-xs font-bold text-muted">{t.linkUrl}</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                apply();
              }
            }}
            dir="ltr"
            autoFocus
            className="w-full rounded-lg border border-outline-variant px-2.5 py-1.5 text-sm"
            placeholder="https://example.com"
          />
          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={apply}
              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-white hover:opacity-90"
            >
              {t.apply}
            </button>
            {isActive && (
              <button
                type="button"
                onClick={remove}
                className="rounded-lg border border-outline-variant px-3 py-1.5 text-sm font-medium text-muted hover:bg-surface-container"
              >
                {t.removeLink}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
