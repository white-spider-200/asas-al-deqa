import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Eye, Pencil } from 'lucide-react';
import { PostPreview } from '../../components/blog/PostPreview';
import { RichTextEditor } from '../../components/blog/RichTextEditor';
import { blogApi, type BlogPostInput } from '../../lib/blog-api';
import { adminLabels, useAdminLang } from '../../lib/admin-i18n';

const emptyForm: BlogPostInput = {
  slug: '',
  titleAr: '',
  titleEn: '',
  excerptAr: '',
  excerptEn: '',
  contentAr: '',
  contentEn: '',
  coverImage: null,
  tagAr: '',
  tagEn: '',
  published: false,
};

export function AdminBlogEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { uiLang, setUiLang } = useAdminLang();
  const t = adminLabels[uiLang];
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [form, setForm] = useState<BlogPostInput>(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [langTab, setLangTab] = useState<'ar' | 'en'>('en');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(73);

  // The header wraps to two rows on narrow screens, so its height is not a
  // constant. Track it and hand it to the editor toolbar's sticky offset.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setHeaderHeight(Math.round(entry.contentRect.height) + 1); // +1 for the border
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [authed]);

  useEffect(() => {
    blogApi
      .me()
      .then(async (res) => {
        setAuthed(res.authenticated);
        if (!res.authenticated || isNew) return;
        const post = await blogApi.adminGet(id!);
        setForm({
          slug: post.slug,
          titleAr: post.titleAr,
          titleEn: post.titleEn,
          excerptAr: post.excerptAr,
          excerptEn: post.excerptEn,
          contentAr: post.contentAr,
          contentEn: post.contentEn,
          coverImage: post.coverImage,
          tagAr: post.tagAr || '',
          tagEn: post.tagEn || '',
          published: post.published,
        });
      })
      .catch((err) => {
        setAuthed(false);
        setError(err instanceof Error ? err.message : t.loadFailed);
      })
      .finally(() => {
        setChecking(false);
        setLoading(false);
      });
  }, [id, isNew, t.loadFailed]);

  if (checking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted">
        {t.loading}
      </div>
    );
  }

  if (!authed) {
    return <Navigate to="/admin" replace />;
  }

  const setField = <K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onCoverUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const { url } = await blogApi.upload(file);
        setField('coverImage', url);
      } catch (err) {
        window.alert(err instanceof Error ? err.message : t.uploadFailed);
      }
    };
    input.click();
  };

  const onSave = async (publish?: boolean) => {
    setSaving(true);
    setError(null);
    const payload: BlogPostInput = {
      ...form,
      published: publish === undefined ? Boolean(form.published) : publish,
      tagAr: form.tagAr || null,
      tagEn: form.tagEn || null,
    };
    try {
      if (isNew) {
        const created = await blogApi.create(payload);
        navigate(`/admin/blog/${created.id}`, { replace: true });
      } else {
        await blogApi.update(id!, payload);
        setForm((prev) => ({ ...prev, published: payload.published }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const uiDir = uiLang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div
      className="min-h-screen bg-background text-on-surface pb-20"
      dir={uiDir}
      // Measured from the header below, so the editor toolbar parks flush
      // against it and no text slides through the gap.
      style={{ ['--editor-toolbar-offset' as string]: `${headerHeight}px` }}
    >
      <header ref={headerRef} className="border-b border-outline-variant bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/admin/blog" className="text-sm text-primary font-bold hover:underline">
              {uiLang === 'ar' ? '→' : '←'} {t.allPosts}
            </Link>
            <h1 className="text-xl font-black mt-1">{isNew ? t.newPost : t.editPost}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setUiLang(uiLang === 'ar' ? 'en' : 'ar')}
              title={t.switchUiLang}
              className="rounded-lg border border-outline-variant px-3 py-2 text-sm font-bold hover:bg-surface-container"
            >
              {uiLang === 'ar' ? 'EN' : 'ع'}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => onSave(false)}
              className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-bold hover:bg-surface-container disabled:opacity-60"
            >
              {t.saveDraft}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => onSave(true)}
              className="rounded-lg bg-primary text-white px-4 py-2 text-sm font-bold hover:opacity-90 disabled:opacity-60"
            >
              {form.published ? t.updatePublish : t.publish}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-bold mb-1.5 block">{t.slug}</span>
            <input
              value={form.slug || ''}
              onChange={(e) => setField('slug', e.target.value)}
              placeholder={t.slugPlaceholder}
              dir="ltr"
              className="w-full rounded-lg border border-outline-variant px-3 py-2"
            />
          </label>
          <div className="block">
            <span className="text-sm font-bold mb-1.5 block">{t.coverImage}</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCoverUpload}
                className="rounded-lg border border-outline-variant px-3 py-2 text-sm font-medium hover:bg-surface-container"
              >
                {t.upload}
              </button>
              {form.coverImage && (
                <img src={form.coverImage} alt="" className="h-10 w-16 object-cover rounded" />
              )}
              {form.coverImage && (
                <button
                  type="button"
                  className="text-sm text-muted hover:text-red-600"
                  onClick={() => setField('coverImage', null)}
                >
                  {t.remove}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant">
          <div className="flex gap-2">
            {(['en', 'ar'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setLangTab(tab)}
                className={`px-4 py-2 text-sm font-bold border-b-2 -mb-px ${
                  langTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted hover:text-on-surface'
                }`}
              >
                {tab === 'en' ? 'English' : 'العربية'}
              </button>
            ))}
          </div>

          <div className="flex gap-1 mb-1.5 rounded-lg bg-surface-container p-1">
            {([
              ['edit', t.edit, Pencil],
              ['preview', t.preview, Eye],
            ] as const).map(([value, label, Icon]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-bold transition-colors ${
                  mode === value ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-on-surface'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {mode === 'preview' ? (
          <PostPreview
            lang={langTab}
            title={langTab === 'ar' ? form.titleAr : form.titleEn}
            excerpt={(langTab === 'ar' ? form.excerptAr : form.excerptEn) || ''}
            content={(langTab === 'ar' ? form.contentAr : form.contentEn) || ''}
            coverImage={form.coverImage}
            tag={langTab === 'ar' ? form.tagAr : form.tagEn}
          />
        ) : langTab === 'en' ? (
          <div className="space-y-4" dir="ltr">
            <label className="block">
              <span className="text-sm font-bold mb-1.5 block">{t.titleField} (EN)</span>
              <input
                value={form.titleEn}
                onChange={(e) => setField('titleEn', e.target.value)}
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold mb-1.5 block">{t.tagField} (EN)</span>
              <input
                value={form.tagEn || ''}
                onChange={(e) => setField('tagEn', e.target.value)}
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
                placeholder="Article, Analysis…"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold mb-1.5 block">{t.excerptField} (EN)</span>
              <textarea
                value={form.excerptEn || ''}
                onChange={(e) => setField('excerptEn', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
              />
            </label>
            <div>
              <span className="text-sm font-bold mb-1.5 block">{t.contentField} (EN)</span>
              <RichTextEditor
                value={form.contentEn || ''}
                onChange={(html) => setField('contentEn', html)}
                dir="ltr"
                lang={uiLang}
                placeholder="Write the English article…"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4" dir="rtl">
            <label className="block">
              <span className="text-sm font-bold mb-1.5 block">{t.titleField} (AR)</span>
              <input
                value={form.titleAr}
                onChange={(e) => setField('titleAr', e.target.value)}
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold mb-1.5 block">{t.tagField} (AR)</span>
              <input
                value={form.tagAr || ''}
                onChange={(e) => setField('tagAr', e.target.value)}
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
                placeholder="مقالة، تحليل…"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold mb-1.5 block">{t.excerptField} (AR)</span>
              <textarea
                value={form.excerptAr || ''}
                onChange={(e) => setField('excerptAr', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
              />
            </label>
            <div>
              <span className="text-sm font-bold mb-1.5 block">{t.contentField} (AR)</span>
              <RichTextEditor
                value={form.contentAr || ''}
                onChange={(html) => setField('contentAr', html)}
                dir="rtl"
                lang={uiLang}
                placeholder="اكتب المقالة بالعربية…"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
