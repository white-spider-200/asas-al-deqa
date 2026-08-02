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
  },
} as const;
