import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
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
  /** Language of the toolbar tooltips, not of the content. */
  lang?: 'ar' | 'en';
};

const LABELS = {
  en: {
    bold: 'Bold',
    italic: 'Italic',
    strike: 'Strikethrough',
    h2: 'Heading',
    h3: 'Subheading',
    bullet: 'Bullet list',
    ordered: 'Numbered list',
    quote: 'Quote',
    rule: 'Divider',
    link: 'Link',
    image: 'Insert image',
    undo: 'Undo',
    redo: 'Redo',
    linkPrompt: 'Link URL',
    uploadFailed: 'Upload failed',
  },
  ar: {
    bold: 'عريض',
    italic: 'مائل',
    strike: 'يتوسطه خط',
    h2: 'عنوان رئيسي',
    h3: 'عنوان فرعي',
    bullet: 'قائمة نقطية',
    ordered: 'قائمة مرقمة',
    quote: 'اقتباس',
    rule: 'فاصل',
    link: 'رابط',
    image: 'إدراج صورة',
    undo: 'تراجع',
    redo: 'إعادة',
    linkPrompt: 'رابط URL',
    uploadFailed: 'فشل رفع الصورة',
  },
} as const;

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
        active
          ? 'bg-primary text-white'
          : 'text-on-surface hover:bg-surface-container',
      )}
    >
      {children}
    </button>
  );
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
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
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
    },
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

  return (
    <div className={cn('overflow-hidden rounded-xl border border-outline-variant bg-white', className)}>
      <div
        className="sticky top-[73px] z-[5] flex flex-wrap items-center gap-1 border-b border-outline-variant bg-background px-2 py-2"
        dir={dir}
      >
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
          title={t.strike}
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={16} />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-outline-variant" />
        <ToolbarButton
          title={t.h2}
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          title={t.h3}
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={16} />
        </ToolbarButton>
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
    </div>
  );
}
