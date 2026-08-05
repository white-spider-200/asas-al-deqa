import { useCallback, useEffect, useState } from 'react';

export type AdminLang = 'ar' | 'en';

const STORAGE_KEY = 'adfta-admin-lang';

/**
 * UI language for the admin panel chrome. Independent of the language of the
 * post being written — a marketing editor can work in an Arabic interface while
 * writing the English version of an article.
 */
export function useAdminLang() {
  const [uiLang, setUiLangState] = useState<AdminLang>(() => {
    if (typeof window === 'undefined') return 'ar';
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'en' || stored === 'ar' ? stored : 'ar';
  });

  const setUiLang = useCallback((lang: AdminLang) => {
    setUiLangState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Private browsing / storage disabled — fall back to in-memory only.
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('lang', uiLang);
  }, [uiLang]);

  return { uiLang, setUiLang };
}

export const adminLabels = {
  en: {
    allPosts: 'All posts',
    newPost: 'New post',
    editPost: 'Edit post',
    saveDraft: 'Save draft',
    publish: 'Publish',
    updatePublish: 'Update & publish',
    slug: 'Slug (URL)',
    slugPlaceholder: 'auto-from-english-title',
    coverImage: 'Cover image',
    upload: 'Upload',
    remove: 'Remove',
    titleField: 'Title',
    tagField: 'Tag',
    excerptField: 'Excerpt',
    contentField: 'Content',
    edit: 'Edit',
    preview: 'Preview',
    loading: 'Loading…',
    loadFailed: 'Failed to load',
    saveFailed: 'Save failed',
    uploadFailed: 'Upload failed',
    errTitleRequired: 'Add a title in Arabic or English before saving.',
    errBothTitles:
      'Publishing needs both the Arabic and English titles. Add the missing one, or use “Save draft” to keep your work for now.',
    switchUiLang: 'Switch interface to Arabic',
    // Post list
    posts: 'Posts',
    createPost: 'New post',
    published: 'Published',
    draft: 'Draft',
    noPosts: 'No posts yet.',
    deleteConfirm: 'Delete this post? This cannot be undone.',
    delete: 'Delete',
    logout: 'Log out',
    updated: 'Updated',
    editor: {
      normal: 'Normal text',
      h1: 'Heading 1',
      h2: 'Heading 2',
      h3: 'Heading 3',
      blockType: 'Text style',
      bold: 'Bold',
      italic: 'Italic',
      underline: 'Underline',
      strike: 'Strikethrough',
      inlineCode: 'Inline code',
      clearFormat: 'Clear formatting',
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
      align: 'Alignment',
      alignLeft: 'Align left',
      alignCenter: 'Centre',
      alignRight: 'Align right',
      alignJustify: 'Justify',
      linkUrl: 'Link address',
      apply: 'Apply',
      removeLink: 'Remove link',
      uploading: 'Uploading…',
      uploadFailed: 'Upload failed',
      dismiss: 'Dismiss',
      words: 'words',
      readTime: 'min read',
      hint: 'Tip: type ## then a space for a heading, or - then a space for a list.',
    },
  },
  ar: {
    allPosts: 'كل المقالات',
    newPost: 'مقالة جديدة',
    editPost: 'تعديل المقالة',
    saveDraft: 'حفظ كمسودة',
    publish: 'نشر',
    updatePublish: 'تحديث ونشر',
    slug: 'الرابط (Slug)',
    slugPlaceholder: 'يُنشأ تلقائياً من العنوان الإنجليزي',
    coverImage: 'صورة الغلاف',
    upload: 'رفع',
    remove: 'إزالة',
    titleField: 'العنوان',
    tagField: 'الوسم',
    excerptField: 'المقتطف',
    contentField: 'المحتوى',
    edit: 'تحرير',
    preview: 'معاينة',
    loading: 'جاري التحميل…',
    loadFailed: 'تعذّر التحميل',
    saveFailed: 'تعذّر الحفظ',
    uploadFailed: 'فشل رفع الصورة',
    errTitleRequired: 'أضف عنواناً بالعربية أو الإنجليزية قبل الحفظ.',
    errBothTitles:
      'النشر يتطلب العنوان بالعربية والإنجليزية معاً. أضف العنوان الناقص، أو استخدم «حفظ كمسودة» للاحتفاظ بعملك الآن.',
    switchUiLang: 'تغيير لغة الواجهة إلى الإنجليزية',
    // Post list
    posts: 'المقالات',
    createPost: 'مقالة جديدة',
    published: 'منشورة',
    draft: 'مسودة',
    noPosts: 'لا توجد مقالات بعد.',
    deleteConfirm: 'هل تريد حذف هذه المقالة؟ لا يمكن التراجع عن هذا الإجراء.',
    delete: 'حذف',
    logout: 'تسجيل الخروج',
    updated: 'آخر تحديث',
    editor: {
      normal: 'نص عادي',
      h1: 'عنوان ١',
      h2: 'عنوان ٢',
      h3: 'عنوان ٣',
      blockType: 'نمط النص',
      bold: 'عريض',
      italic: 'مائل',
      underline: 'تسطير',
      strike: 'يتوسطه خط',
      inlineCode: 'كود مضمّن',
      clearFormat: 'إزالة التنسيق',
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
      align: 'المحاذاة',
      alignLeft: 'محاذاة لليسار',
      alignCenter: 'توسيط',
      alignRight: 'محاذاة لليمين',
      alignJustify: 'ضبط',
      linkUrl: 'عنوان الرابط',
      apply: 'تطبيق',
      removeLink: 'إزالة الرابط',
      uploading: 'جاري الرفع…',
      uploadFailed: 'فشل رفع الصورة',
      dismiss: 'إغلاق',
      words: 'كلمة',
      readTime: 'دقيقة قراءة',
      hint: 'تلميح: اكتب ## ثم مسافة لإنشاء عنوان، أو - ثم مسافة لإنشاء قائمة.',
    },
  },
} as const;

/**
 * Values are widened to `string`: `as const` gives each language its own literal
 * types, so a type taken straight from the English dictionary would reject the
 * Arabic one.
 */
export type EditorLabels = Record<keyof (typeof adminLabels)['en']['editor'], string>;
