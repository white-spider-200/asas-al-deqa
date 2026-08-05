import React from 'react';
import type { EditorLabels } from '../../../lib/admin-i18n';

type EditorStatsProps = {
  words: number;
  minutes: number;
  t: EditorLabels;
  dir: 'rtl' | 'ltr';
};

export function EditorStats({ words, minutes, t, dir }: EditorStatsProps) {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-2 rounded-b-xl border-t border-outline-variant bg-background px-4 py-2 text-xs text-muted"
      dir={dir}
    >
      <span>{t.hint}</span>
      <span className="whitespace-nowrap font-medium">
        {words} {t.words}
        {minutes > 0 && ` · ${minutes} ${t.readTime}`}
      </span>
    </div>
  );
}
