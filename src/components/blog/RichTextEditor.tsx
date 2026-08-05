/**
 * The editor lives in ./editor/. This shim keeps the original import path
 * working for existing call sites (AdminBlogEditor).
 */
export { RichTextEditor } from './editor/RichTextEditor';
export type { RichTextEditorProps } from './editor/RichTextEditor';
