export type BlogPost = {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  coverImage: string | null;
  tagAr: string | null;
  tagEn: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostListItem = Omit<BlogPost, 'contentAr' | 'contentEn' | 'published' | 'updatedAt'>;

export type BlogPostInput = {
  slug?: string;
  titleAr: string;
  titleEn: string;
  excerptAr?: string;
  excerptEn?: string;
  contentAr?: string;
  contentEn?: string;
  coverImage?: string | null;
  tagAr?: string | null;
  tagEn?: string | null;
  published?: boolean;
};

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data === 'object' && data && 'error' in data
        ? String((data as { error: string }).error)
        : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

export const blogApi = {
  listPublished(): Promise<BlogPostListItem[]> {
    return fetch('/api/blog').then((res) => parseJson(res));
  },

  getPublished(slug: string): Promise<BlogPost> {
    return fetch(`/api/blog/${encodeURIComponent(slug)}`).then((res) => parseJson(res));
  },

  me(): Promise<{ authenticated: boolean }> {
    return fetch('/api/auth/me', { credentials: 'include' }).then(async (res) => {
      if (res.status === 401) return { authenticated: false };
      return parseJson(res);
    });
  },

  login(password: string): Promise<{ ok: boolean }> {
    return fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    }).then((res) => parseJson(res));
  },

  logout(): Promise<{ ok: boolean }> {
    return fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).then((res) => parseJson(res));
  },

  adminList(): Promise<BlogPost[]> {
    return fetch('/api/admin/blog', { credentials: 'include' }).then((res) => parseJson(res));
  },

  adminGet(id: string): Promise<BlogPost> {
    return fetch(`/api/admin/blog/${encodeURIComponent(id)}`, {
      credentials: 'include',
    }).then((res) => parseJson(res));
  },

  create(input: BlogPostInput): Promise<BlogPost> {
    return fetch('/api/admin/blog', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }).then((res) => parseJson(res));
  },

  update(id: string, input: BlogPostInput): Promise<BlogPost> {
    return fetch(`/api/admin/blog/${encodeURIComponent(id)}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }).then((res) => parseJson(res));
  },

  remove(id: string): Promise<{ ok: boolean }> {
    return fetch(`/api/admin/blog/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then((res) => parseJson(res));
  },

  upload(file: File): Promise<{ url: string }> {
    const form = new FormData();
    form.append('file', file);
    return fetch('/api/admin/upload', {
      method: 'POST',
      credentials: 'include',
      body: form,
    }).then((res) => parseJson(res));
  },
};
