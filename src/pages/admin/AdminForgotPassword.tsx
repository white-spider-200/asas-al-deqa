import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { blogApi } from '../../lib/blog-api';

export function AdminForgotPassword() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await blogApi.forgotPassword();
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm rounded-2xl border border-outline-variant bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-black text-on-surface mb-2">Reset admin password</h1>
        {sent ? (
          <p className="text-sm text-on-surface mb-4">
            If admin auth is configured, a reset link was emailed to the admin address. It expires in 30 minutes.
          </p>
        ) : (
          <>
            <p className="text-sm text-muted mb-6">
              We&rsquo;ll email a reset link to the configured admin address.
            </p>
            <form onSubmit={onSubmit}>
              {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-primary text-white font-bold py-2.5 hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          </>
        )}
        <Link to="/admin" className="block text-center text-sm text-muted mt-4 hover:text-primary">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
