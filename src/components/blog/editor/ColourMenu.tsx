import React, { useCallback, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { ChevronDown, Palette } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { AdminLang, EditorLabels } from '../../../lib/admin-i18n';
import { HIGHLIGHTS, TEXT_COLOURS } from './constants';
import { useClickOutside } from './useClickOutside';

type ColourMenuProps = {
  editor: Editor;
  t: EditorLabels;
  lang: AdminLang;
  dir: 'rtl' | 'ltr';
};

function Swatch({
  value,
  title,
  selected,
  onClick,
}: {
  value: string;
  title: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={cn(
        'h-7 w-7 rounded-md border transition-transform hover:scale-110',
        selected ? 'border-primary ring-2 ring-primary/30' : 'border-outline-variant',
      )}
      style={{ background: value }}
    />
  );
}

export function ColourMenu({ editor, t, lang, dir }: ColourMenuProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside(close);

  const activeColour = (editor.getAttributes('textStyle').color as string | undefined) || null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        title={t.colour}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm transition-colors',
          open ? 'bg-surface-container' : 'hover:bg-surface-container',
        )}
      >
        <Palette size={16} style={activeColour ? { color: activeColour } : undefined} />
        <ChevronDown size={12} className="opacity-60" />
      </button>

      {open && (
        <div
          className="absolute z-20 mt-1 w-56 rounded-lg border border-outline-variant bg-white p-3 shadow-lg"
          style={dir === 'rtl' ? { right: 0 } : { left: 0 }}
        >
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-bold text-muted">{t.colour}</p>
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetColor().run()}
              className="text-xs font-bold text-muted hover:text-on-surface"
            >
              {t.none}
            </button>
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {TEXT_COLOURS.map((c) => (
              <Swatch
                key={c.value}
                value={c.value}
                title={c.label[lang]}
                selected={activeColour?.toLowerCase() === c.value.toLowerCase()}
                onClick={() => editor.chain().focus().setColor(c.value).run()}
              />
            ))}
          </div>

          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-bold text-muted">{t.highlight}</p>
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetHighlight().run()}
              className="text-xs font-bold text-muted hover:text-on-surface"
            >
              {t.none}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {HIGHLIGHTS.map((h) => (
              <Swatch
                key={h.value}
                value={h.value}
                title={h.label[lang]}
                selected={editor.isActive('highlight', { color: h.value })}
                onClick={() => editor.chain().focus().toggleHighlight({ color: h.value }).run()}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
