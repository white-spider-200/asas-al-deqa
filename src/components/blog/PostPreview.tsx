import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type PostPreviewProps = {
  lang: 'ar' | 'en';
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  tag?: string | null;
};

/**
 * Renders a post exactly as InsightPost renders it on the live site, so the
 * marketing team can see the published result before hitting Publish.
 * Keep the markup here in sync with src/pages/InsightPost.tsx.
 */
export function PostPreview({
  lang,
  title,
  excerpt,
  content,
  coverImage,
  tag,
}: PostPreviewProps) {
  const isArabic = lang === 'ar';
  const dir = isArabic ? 'rtl' : 'ltr';
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const emptyTitle = isArabic ? 'عنوان المقالة' : 'Article title';
  const emptyBody = isArabic
    ? 'لا يوجد محتوى بعد. اكتب المقالة في وضع التحرير لتظهر هنا.'
    : 'No content yet. Write the article in Edit mode and it will appear here.';

  return (
    <div className="rounded-xl border border-outline-variant overflow-hidden">
      <div className="border-b border-outline-variant bg-background px-4 py-2 text-xs font-bold text-muted">
        {isArabic ? 'معاينة كما ستظهر على الموقع' : 'Preview — as it will appear on the website'}
      </div>

      <div className="bg-background font-sans text-on-surface" dir={dir}>
        <article className="px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-primary mb-10">
              <BackIcon size={16} />
              {isArabic ? 'العودة إلى الرؤى' : 'Back to Insights'}
            </span>

            {tag && (
              <span className="text-xs font-bold uppercase tracking-wider text-primary mb-4 block">
                {tag}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
              {title || <span className="text-on-surface-variant">{emptyTitle}</span>}
            </h1>

            {excerpt && (
              <p className="text-xl text-muted font-medium leading-relaxed mb-10">{excerpt}</p>
            )}

            {coverImage && (
              <img
                src={coverImage}
                alt={title}
                className="w-full rounded-xl mb-12 object-cover max-h-[420px]"
              />
            )}

            {content?.trim() ? (
              <div
                className="article-content"
                dir={dir}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-on-surface-variant italic">{emptyBody}</p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
