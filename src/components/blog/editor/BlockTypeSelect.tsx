import React, { useCallback, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { EditorLabels } from '../../../lib/admin-i18n';
import { BLOCK_TYPES } from './constants';
import { useClickOutside } from './useClickOutside';

type BlockTypeSelectProps = {
  editor: Editor;
  t: EditorLabels;
  dir: 'rtl' | 'ltr';
};

export function BlockTypeSelect({ editor, t, dir }: BlockTypeSelectProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside(close);

  const options = BLOCK_TYPES.map((type) => ({
    ...type,
    label: t[type.labelKey],
    isActive:
      type.kind === 'paragraph'
        ? editor.isActive('paragraph') && !editor.isActive('heading')
        : editor.isActive('heading', { level: type.level }),
    apply: () =>
      type.kind === 'paragraph'
        ? editor.chain().focus().setParagraph().run()
        : editor.chain().focus().setHeading({ level: type.level }).run(),
  }));

  const current = options.find((o) => o.isActive)?.label ?? t.normal;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        title={t.blockType}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 min-w-[8.5rem] items-center justify-between gap-2 rounded-md border border-outline-variant bg-white px-2.5 text-sm font-medium text-on-surface hover:bg-surface-container"
      >
        <span className="truncate">{current}</span>
        <ChevronDown size={14} className="shrink-0 opacity-60" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-20 mt-1 min-w-[11rem] overflow-hidden rounded-lg border border-outline-variant bg-white py-1 shadow-lg"
          style={dir === 'rtl' ? { right: 0 } : { left: 0 }}
        >
          {options.map((opt) => (
            <button
              key={opt.label}
              type="button"
              role="option"
              aria-selected={opt.isActive}
              onClick={() => {
                opt.apply();
                close();
              }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-start hover:bg-surface-container',
                opt.isActive ? 'text-primary' : 'text-on-surface',
              )}
              style={{ fontSize: opt.previewSize, fontWeight: opt.weight }}
            >
              <Check
                size={14}
                className={cn('shrink-0', opt.isActive ? 'opacity-100' : 'opacity-0')}
              />
              <span className="truncate">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
