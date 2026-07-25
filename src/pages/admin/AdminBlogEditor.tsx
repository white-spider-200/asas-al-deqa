import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { RichTextEditor } from '../../components/blog/RichTextEditor';
import { blogApi, type BlogPostInput } from '../../lib/blog-api';

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
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [form, setForm] = useState<BlogPostInput>(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [langTab, setLangTab] = useState<'ar' | 'en'>('en');

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
        setError(err instanceof Error ? err.message : 'Failed to load');
      })
      .finally(() => {
        setChecking(false);
        setLoading(false);
      });
  }, [id, isNew]);

  if (checking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted">
        Loading…
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
        window.alert(err instanceof Error ? err.message : 'Upload failed');
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
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface pb-20">
      <header className="border-b border-outline-variant bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/admin/blog" className="text-sm text-primary font-bold hover:underline">
              ← All posts
            </Link>
            <h1 className="text-xl font-black mt-1">{isNew ? 'New post' : 'Edit post'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => onSave(false)}
              className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-bold hover:bg-surface-container disabled:opacity-60"
            >
              Save draft
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => onSave(true)}
              className="rounded-lg bg-primary text-white px-4 py-2 text-sm font-bold hover:opacity-90 disabled:opacity-60"
            >
              {form.published ? 'Update & publish' : 'Publish'}
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
            <span className="text-sm font-bold mb-1.5 block">Slug</span>
            <input
              value={form.slug || ''}
              onChange={(e) => setField('slug', e.target.value)}
              placeholder="auto-from-english-title"
              className="w-full rounded-lg border border-outline-variant px-3 py-2"
            />
          </label>
          <div className="block">
            <span className="text-sm font-bold mb-1.5 block">Cover image</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCoverUpload}
                className="rounded-lg border border-outline-variant px-3 py-2 text-sm font-medium hover:bg-surface-container"
              >
                Upload
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
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-b border-outline-variant">
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

        {langTab === 'en' ? (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold mb-1.5 block">Title (EN)</span>
              <input
                value={form.titleEn}
                onChange={(e) => setField('titleEn', e.target.value)}
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold mb-1.5 block">Tag (EN)</span>
              <input
                value={form.tagEn || ''}
                onChange={(e) => setField('tagEn', e.target.value)}
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
                placeholder="Article, Analysis…"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold mb-1.5 block">Excerpt (EN)</span>
              <textarea
                value={form.excerptEn || ''}
                onChange={(e) => setField('excerptEn', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
              />
            </label>
            <div>
              <span className="text-sm font-bold mb-1.5 block">Content (EN)</span>
              <RichTextEditor
                value={form.contentEn || ''}
                onChange={(html) => setField('contentEn', html)}
                dir="ltr"
                placeholder="Write the English article…"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4" dir="rtl">
            <label className="block">
              <span className="text-sm font-bold mb-1.5 block">العنوان (AR)</span>
              <input
                value={form.titleAr}
                onChange={(e) => setField('titleAr', e.target.value)}
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold mb-1.5 block">الوسم (AR)</span>
              <input
                value={form.tagAr || ''}
                onChange={(e) => setField('tagAr', e.target.value)}
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
                placeholder="مقالة، تحليل…"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold mb-1.5 block">المقتطف (AR)</span>
              <textarea
                value={form.excerptAr || ''}
                onChange={(e) => setField('excerptAr', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
              />
            </label>
            <div>
              <span className="text-sm font-bold mb-1.5 block">المحتوى (AR)</span>
              <RichTextEditor
                value={form.contentAr || ''}
                onChange={(html) => setField('contentAr', html)}
                dir="rtl"
                placeholder="اكتب المقالة بالعربية…"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
