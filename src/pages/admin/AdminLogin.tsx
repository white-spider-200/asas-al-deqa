import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { blogApi } from '../../lib/blog-api';

export function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    blogApi
      .me()
      .then((res) => {
        setAuthed(res.authenticated);
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

  if (authed) {
    return <Navigate to="/admin/blog" replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await blogApi.login(password);
      navigate('/admin/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-outline-variant bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-black text-on-surface mb-2">Blog Admin</h1>
        <p className="text-sm text-muted mb-6">Sign in to manage insights articles.</p>
        <label className="block text-sm font-bold mb-2 text-on-surface" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-outline-variant px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          autoComplete="current-password"
          required
        />
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary text-white font-bold py-2.5 hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
        <Link to="/admin/forgot-password" className="block text-center text-sm text-muted mt-4 hover:text-primary">
          Forgot password?
        </Link>
        <Link to="/ar" className="block text-center text-sm text-muted mt-2 hover:text-primary">
          Back to site
        </Link>
      </form>
    </div>
  );
}
