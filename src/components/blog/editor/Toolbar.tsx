import React from 'react';
import type { Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react';
import type { AdminLang, EditorLabels } from '../../../lib/admin-i18n';
import { BlockTypeSelect } from './BlockTypeSelect';
import { ColourMenu } from './ColourMenu';
import { LinkPopover } from './LinkPopover';
import { ToolbarButton, ToolbarDivider } from './ToolbarButton';
import { ALIGNMENTS } from './constants';

type ToolbarProps = {
  editor: Editor;
  t: EditorLabels;
  lang: AdminLang;
  dir: 'rtl' | 'ltr';
  uploading: boolean;
  onInsertImage: () => void;
};

const ALIGN_ICONS = {
  left: AlignLeft,
  center: AlignCenter,
  right: AlignRight,
  justify: AlignJustify,
} as const;

const ALIGN_LABEL_KEYS = {
  left: 'alignLeft',
  center: 'alignCenter',
  right: 'alignRight',
  justify: 'alignJustify',
} as const;

export function Toolbar({ editor, t, lang, dir, uploading, onInsertImage }: ToolbarProps) {
  return (
    <div
      // top-0 within the sticky container; the admin page sets the offset via
      // --editor-toolbar-offset so this is not coupled to the header height.
      className="sticky z-[5] flex flex-wrap items-center gap-1 border-b border-outline-variant bg-background px-2 py-2"
      style={{ top: 'var(--editor-toolbar-offset, 0px)' }}
      dir={dir}
    >
      <BlockTypeSelect editor={editor} t={t} dir={dir} />

      <ToolbarDivider />

      <ToolbarButton
        title={t.bold}
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        title={t.italic}
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        title={t.underline}
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        title={t.strike}
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </ToolbarButton>
      <ToolbarButton
        title={t.inlineCode}
        active={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code size={16} />
      </ToolbarButton>

      <ColourMenu editor={editor} t={t} lang={lang} dir={dir} />

      <ToolbarButton
        title={t.clearFormat}
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      >
        <RemoveFormatting size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title={t.bullet}
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        title={t.ordered}
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolbarButton>
      <ToolbarButton
        title={t.quote}
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      {ALIGNMENTS.map((align) => {
        const Icon = ALIGN_ICONS[align];
        return (
          <ToolbarButton
            key={align}
            title={t[ALIGN_LABEL_KEYS[align]]}
            active={editor.isActive({ textAlign: align })}
            onClick={() => editor.chain().focus().setTextAlign(align).run()}
          >
            <Icon size={16} />
          </ToolbarButton>
        );
      })}

      <ToolbarDivider />

      <LinkPopover editor={editor} t={t} dir={dir} />
      <ToolbarButton
        title={uploading ? t.uploading : t.image}
        disabled={uploading}
        onClick={onInsertImage}
      >
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
      </ToolbarButton>
      <ToolbarButton
        title={t.rule}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title={t.undo}
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        title={t.redo}
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 size={16} />
      </ToolbarButton>
    </div>
  );
}
