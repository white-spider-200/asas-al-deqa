import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { blogApi } from '../../lib/blog-api';

const MIN_PASSWORD_LENGTH = 12;

export function AdminResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm rounded-2xl border border-outline-variant bg-white p-8 shadow-sm text-center">
          <h1 className="text-2xl font-black text-on-surface mb-2">Invalid link</h1>
          <p className="text-sm text-muted mb-6">This reset link is missing its token.</p>
          <Link to="/admin/forgot-password" className="text-sm text-primary font-bold">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await blogApi.resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm rounded-2xl border border-outline-variant bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-black text-on-surface mb-2">Set a new password</h1>
        {done ? (
          <p className="text-sm text-on-surface mb-4">Password updated. Redirecting to sign in…</p>
        ) : (
          <form onSubmit={onSubmit}>
            <p className="text-sm text-muted mb-6">Choose a new admin password.</p>
            <label className="block text-sm font-bold mb-2 text-on-surface" htmlFor="password">
              New password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-outline-variant px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="new-password"
              required
            />
            <label className="block text-sm font-bold mb-2 text-on-surface" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-outline-variant px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="new-password"
              required
            />
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-primary text-white font-bold py-2.5 hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Set new password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
