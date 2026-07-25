import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, LogOut } from 'lucide-react';
import { blogApi, type BlogPost } from '../../lib/blog-api';

export function AdminBlogList() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    blogApi
      .adminList()
      .then(setPosts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    blogApi
      .me()
      .then((res) => {
        setAuthed(res.authenticated);
        if (res.authenticated) load();
      })
      .catch(() => setAuthed(false))
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted">
        Checking session…
      </div>
    );
  }

  if (!authed) {
    return <Navigate to="/admin" replace />;
  }

  const onDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    try {
      await blogApi.remove(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const onLogout = async () => {
    await blogApi.logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="border-b border-outline-variant bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black">Insights CMS</h1>
            <p className="text-sm text-muted">Create and publish bilingual articles</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/blog/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-4 py-2 text-sm font-bold hover:opacity-90"
            >
              <Plus size={16} />
              New post
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-outline-variant px-3 py-2 text-sm font-medium hover:bg-surface-container"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {loading && <p className="text-muted">Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && posts.length === 0 && (
          <p className="text-muted">No posts yet. Create your first article.</p>
        )}
        <ul className="space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-outline-variant bg-white p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
                      post.published
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-xs text-muted truncate">/{post.slug}</span>
                </div>
                <p className="font-bold truncate">{post.titleEn}</p>
                <p className="text-sm text-muted truncate" dir="rtl">
                  {post.titleAr}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/admin/blog/${post.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant px-3 py-2 text-sm font-medium hover:bg-surface-container"
                >
                  <Pencil size={14} />
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(post.id, post.titleEn)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 text-red-700 px-3 py-2 text-sm font-medium hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
