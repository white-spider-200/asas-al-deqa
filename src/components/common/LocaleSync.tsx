import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LANG, isLang } from '../../lib/locale';

export function LocaleSync({ children }: { children: React.ReactNode }) {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!isLang(lang)) return;
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  if (!isLang(lang)) {
    return <Navigate to={`/${DEFAULT_LANG}`} replace />;
  }

  return <>{children}</>;
}
