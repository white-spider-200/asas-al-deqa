import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  ogImageUrl,
  ogLocale,
} from '../../lib/seo';
import { swapLocalePath, type Lang } from '../../lib/locale';

interface FAQItem {
  q: string;
  a: string;
}

interface SEOProps {
  titleKey?: string;
  descriptionKey?: string;
  title?: string;
  description?: string;
  faqItems?: FAQItem[];
}

export const SEO: React.FC<SEOProps> = ({
  titleKey,
  descriptionKey,
  title: titleProp,
  description: descriptionProp,
  faqItems,
}) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  const title = titleProp ?? (titleKey ? t(titleKey) : SITE_NAME);
  const description = descriptionProp ?? (descriptionKey ? t(descriptionKey) : '');
  const canonical = absoluteUrl(pathname);
  const image = ogImageUrl();
  const locale = ogLocale(i18n.language);
  const isArabic = i18n.language.startsWith('ar');
  const alternateLang: Lang = isArabic ? 'en' : 'ar';

  const orgJsonLd = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: isArabic ? 'أساس الدقة' : SITE_NAME,
        alternateName: isArabic ? SITE_NAME : 'أساس الدقة',
        url: SITE_URL,
        logo: image,
        image,
        email: 'info@adfta.com',
        telephone: '+962797006750',
        description,
        address: {
          '@type': 'PostalAddress',
          streetAddress: isArabic
            ? 'خلدا - إشارات العساف - مجمع بيت العمر، الطابق الأول'
            : 'Khalda - Al-Assaf Traffic Lights - Beit Al Omor Complex, First Floor',
          addressLocality: isArabic ? 'عمّان' : 'Amman',
          addressCountry: 'JO',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Jordan',
        },
      }),
    [description, image, isArabic],
  );

  const faqJsonLd = useMemo(() => {
    if (!faqItems?.length) return null;
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    });
  }, [faqItems]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="ar" href={absoluteUrl(swapLocalePath(pathname, 'ar'))} />
      <link rel="alternate" hrefLang="en" href={absoluteUrl(swapLocalePath(pathname, 'en'))} />
      <link rel="alternate" hrefLang="x-default" href={absoluteUrl(swapLocalePath(pathname, 'ar'))} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={locale} />
      <meta property="og:locale:alternate" content={ogLocale(alternateLang)} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">{orgJsonLd}</script>
      {faqJsonLd && <script type="application/ld+json">{faqJsonLd}</script>}
    </Helmet>
  );
};
