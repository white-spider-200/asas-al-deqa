import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/common/SEO';
import { blogApi, type BlogPostListItem } from '../lib/blog-api';
import { useLocale } from '../hooks/useLocale';
import { localizedPath } from '../lib/locale';
import { absoluteUrl } from '../lib/seo';

function formatPostDate(iso: string | null | undefined, isArabic: boolean) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(isArabic ? 'ar-SA' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const Insights = () => {
  const { i18n } = useTranslation();
  const { locale } = useLocale();
  const isArabic = i18n.language.startsWith('ar');
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ReadIcon = isArabic ? ArrowLeft : ArrowRight;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    blogApi
      .listPublished()
      .then((data) => {
        if (!cancelled) {
          setPosts(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load posts');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const itemListJsonLd = useMemo(() => {
    if (!posts.length) return undefined;
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: isArabic ? 'رؤى ووجهات نظر' : 'Insights & Perspectives',
      description: isArabic
        ? 'مقالات وتحليلات من فريق أساس الدقة حول الضرائب والمحاسبة والاستشارات.'
        : 'Articles and analysis from Asas Al-Deqa on tax, accounting, and advisory.',
      url: absoluteUrl(localizedPath(locale, '/insights')),
      inLanguage: isArabic ? 'ar' : 'en',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: posts.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteUrl(localizedPath(locale, `/insights/${item.slug}`)),
          name: isArabic ? item.titleAr : item.titleEn,
        })),
      },
    };
  }, [posts, isArabic, locale]);

  return (
    <div className="bg-background min-h-screen text-on-surface pt-20 font-sans selection:bg-primary selection:text-white">
      <SEO
        titleKey="seo.insights_title"
        descriptionKey="seo.insights_desc"
        jsonLd={itemListJsonLd}
      />

      {/* Editorial hero */}
      <section className="relative overflow-hidden border-b border-outline-variant bg-gradient-to-b from-white via-white to-background">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-24 end-0 w-[28rem] h-[28rem] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 start-0 w-72 h-72 bg-surface-container/80 rounded-full blur-[100px]" />
        </div>

        <div
          className={`max-w-container-max mx-auto px-6 relative z-10 w-full py-16 md:py-20 ${
            isArabic ? 'text-right' : 'text-left'
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <p className={`text-xs font-bold ${isArabic ? '' : 'uppercase tracking-[0.18em]'} text-primary mb-5 ${isArabic ? 'font-noto-sans-arabic' : ''}`}>
              {isArabic ? 'رؤى ووجهات نظر' : 'Insights & Perspectives'}
            </p>
            <h1 className={`font-bold tracking-tight mb-6 text-on-surface leading-[1.15] ${isArabic ? 'text-[2.7rem] md:text-[4rem] font-noto-sans-arabic' : 'font-noto-serif text-4xl md:text-6xl'}`}>
              {isArabic ? 'بوصلتك في عالم الاستشارات' : 'Your Compass in Advisory'}
            </h1>
            <p className={`text-muted font-medium leading-relaxed max-w-2xl ${isArabic ? 'text-lg md:text-2xl font-noto-sans-arabic' : 'text-base md:text-xl'}`}>
              {isArabic
                ? 'مقالات وتحليلات من فريق أساس الدقة حول الضرائب والمحاسبة والاستشارات.'
                : 'Articles and analysis from Asas Al-Deqa on tax, accounting, and advisory.'}
            </p>
          </motion.div>
        </div>
      </section>
 

      {/* Image-led grid */}
      <section className="py-14 md:py-20 px-6 md:pb-32">
        <div className="max-w-container-max mx-auto">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-[1.4rem] border border-outline-variant bg-white overflow-hidden animate-pulse"
                >
                  <div className="aspect-[16/10] bg-surface-container" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-20 bg-surface-container rounded" />
                    <div className="h-6 w-4/5 bg-surface-container rounded" />
                    <div className="h-4 w-full bg-surface-container rounded" />
                    <div className="h-4 w-2/3 bg-surface-container rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="text-center text-red-600 text-lg">{error}</p>
          )}

          {!loading && !error && posts.length === 0 && (
            <p className="text-center text-muted text-lg py-16">
              {isArabic ? 'لا توجد مقالات منشورة بعد.' : 'No published articles yet.'}
            </p>
          )}

          {!loading && !error && posts.length > 0 && (
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 ${
                isArabic ? 'text-right' : 'text-left'
              }`}
            >
              {posts.map((item, i) => {
                const title = isArabic ? item.titleAr : item.titleEn;
                const excerpt = isArabic ? item.excerptAr : item.excerptEn;
                const tag = isArabic ? item.tagAr : item.tagEn;
                const dateLabel = formatPostDate(item.publishedAt || item.createdAt, isArabic);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i * 0.06, 0.3) }}
                  >
                    <Link
                      to={localizedPath(locale, `/insights/${item.slug}`)}
                      className="group flex flex-col h-full bg-white border border-outline-variant rounded-[1.4rem] overflow-hidden shadow-[0_18px_45px_rgba(0,95,147,0.06)] hover:shadow-[0_24px_60px_rgba(0,95,147,0.14)] hover:border-primary/25 transition-all duration-500"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-surface-container">
                        {item.coverImage ? (
                          <img
                            src={item.coverImage}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-surface-container to-secondary">
                            <div className="absolute start-0 top-0 bottom-0 w-1.5 bg-primary" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col flex-1 p-6 md:p-7">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-xs font-bold uppercase tracking-wider">
                          {tag && <span className="text-primary">{tag}</span>}
                          {tag && dateLabel && (
                            <span className="text-outline-variant" aria-hidden>
                              ·
                            </span>
                          )}
                          {dateLabel && (
                            <time
                              dateTime={item.publishedAt || item.createdAt}
                              className="text-on-surface-variant font-semibold normal-case tracking-normal"
                            >
                              {dateLabel}
                            </time>
                          )}
                        </div>

                        <h2 className="font-noto-serif text-xl md:text-2xl font-bold mb-3 text-on-surface group-hover:text-primary transition-colors leading-snug">
                          {title}
                        </h2>

                        {excerpt && (
                          <p className="text-muted text-sm md:text-base font-medium leading-relaxed line-clamp-3 mb-6">
                            {excerpt}
                          </p>
                        )}

                        <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-primary">
                          {isArabic ? 'اقرأ المقال' : 'Read article'}
                          <ReadIcon
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                          />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
