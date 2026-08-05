import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { blogApi, type BlogPost } from '../lib/blog-api';
import { useLocale } from '../hooks/useLocale';
import { localizedPath } from '../lib/locale';
import { SITE_NAME, absoluteUrl } from '../lib/seo';

export const InsightPost = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const { locale } = useLocale();
  const isArabic = i18n.language.startsWith('ar');
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    blogApi
      .getPublished(slug)
      .then((data) => {
        if (!cancelled) {
          setPost(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setPost(null);
          setError(err instanceof Error ? err.message : 'Not found');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const title = post ? (isArabic ? post.titleAr : post.titleEn) : '';
  const excerpt = post ? (isArabic ? post.excerptAr : post.excerptEn) : '';
  const content = post ? (isArabic ? post.contentAr : post.contentEn) : '';
  const tag = post ? (isArabic ? post.tagAr : post.tagEn) : null;

  const publishedTime = post
    ? new Date(post.publishedAt || post.createdAt).toISOString()
    : undefined;
  const modifiedTime = post ? new Date(post.updatedAt).toISOString() : undefined;

  const articleJsonLd = useMemo(() => {
    if (!post) return undefined;
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: excerpt,
      image: post.coverImage ? absoluteUrl(post.coverImage) : absoluteUrl('/og-image.jpg'),
      datePublished: publishedTime,
      dateModified: modifiedTime,
      author: {
        '@type': 'Organization',
        name: isArabic ? 'أساس الدقة' : SITE_NAME,
      },
      publisher: {
        '@type': 'Organization',
        name: isArabic ? 'أساس الدقة' : SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/og-image.jpg'),
        },
      },
      mainEntityOfPage: absoluteUrl(localizedPath(locale, `/insights/${post.slug}`)),
      inLanguage: isArabic ? 'ar' : 'en',
      ...(tag ? { articleSection: tag, keywords: tag } : {}),
    };
  }, [post, title, excerpt, isArabic, locale, publishedTime, modifiedTime, tag]);

  const breadcrumbJsonLd = useMemo(() => {
    if (!post) return undefined;
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: isArabic ? 'الرئيسية' : 'Home',
          item: absoluteUrl(localizedPath(locale, '/')),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: isArabic ? 'رؤى' : 'Insights',
          item: absoluteUrl(localizedPath(locale, '/insights')),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: title,
          item: absoluteUrl(localizedPath(locale, `/insights/${post.slug}`)),
        },
      ],
    };
  }, [post, title, isArabic, locale]);

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
    <div className="bg-background min-h-screen text-on-surface pt-24 font-sans selection:bg-primary selection:text-white">
      {post && (
        <SEO
          title={`${title} | ${SITE_NAME}`}
          description={excerpt || title}
          ogType="article"
          image={post.coverImage || undefined}
          jsonLd={[articleJsonLd!, breadcrumbJsonLd!].filter(Boolean)}
          articleMeta={{
            publishedTime,
            modifiedTime,
            section: tag || undefined,
            tags: tag ? [tag] : undefined,
          }}
        />
      )}

      <article className="px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <Link
            to={localizedPath(locale, '/insights')}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline mb-10"
          >
            <BackIcon size={16} />
            {isArabic ? 'العودة إلى الرؤى' : 'Back to Insights'}
          </Link>

          {loading && (
            <p className="text-muted text-lg">{isArabic ? 'جاري التحميل…' : 'Loading…'}</p>
          )}
          {error && !loading && (
            <div className="text-center py-20">
              <h1 className="text-3xl font-black mb-4">
                {isArabic ? 'المقالة غير موجودة' : 'Article not found'}
              </h1>
              <p className="text-muted mb-8">{error}</p>
            </div>
          )}

          {post && !loading && (
            <>
              {tag && (
                <span className="text-xs font-bold uppercase tracking-wider text-primary mb-4 block">
                  {tag}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
                {title}
              </h1>
              {excerpt && (
                <p className="text-xl text-muted font-medium leading-relaxed mb-10">{excerpt}</p>
              )}
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={title}
                  className="w-full rounded-xl mb-12 object-cover max-h-[420px]"
                />
              )}
              <div
                className="article-content"
                dir={isArabic ? 'rtl' : 'ltr'}
                dangerouslySetInnerHTML={{ __html: content }}
              />

              <div className="mt-16 border-t border-outline-variant pt-12">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3 text-on-surface">
                  {isArabic ? 'هل تحتاج استشارة مهنية؟' : 'Need professional advice?'}
                </h2>
                <p className="text-muted text-base md:text-lg font-medium leading-relaxed mb-8 max-w-xl">
                  {isArabic
                    ? 'تواصل مع فريق أساس الدقة لمناقشة وضعك الضريبي أو المحاسبي والحصول على توجيه واضح.'
                    : 'Talk with the Asas Al-Deqa team about your tax or accounting needs and get clear next steps.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to={localizedPath(locale, '/contact')}
                    className="inline-flex items-center justify-center rounded-xl bg-[#005F93] px-8 py-3.5 text-sm font-black uppercase tracking-tight text-white transition-colors hover:bg-[#004B75]"
                  >
                    {isArabic ? 'احجز استشارتك' : 'Book a consultation'}
                  </Link>
                  <a
                    href="https://wa.me/962797006750"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-[#005F93]/30 px-8 py-3.5 text-sm font-black uppercase tracking-tight text-[#005F93] transition-colors hover:border-[#005F93] hover:bg-[#005F93]/5"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </article>
    </div>
  );
};
