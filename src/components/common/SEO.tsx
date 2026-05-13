import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  titleKey: string;
  descriptionKey: string;
}

export const SEO: React.FC<SEOProps> = ({ titleKey, descriptionKey }) => {
  const { t } = useTranslation();

  return (
    <Helmet>
      <title>{t(titleKey)}</title>
      <meta name="description" content={t(descriptionKey)} />
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={t(titleKey)} />
      <meta property="og:description" content={t(descriptionKey)} />
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={t(titleKey)} />
      <meta property="twitter:description" content={t(descriptionKey)} />
    </Helmet>
  );
};
