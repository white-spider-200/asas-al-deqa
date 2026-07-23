import { useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  DEFAULT_LANG,
  isLang,
  localizedPath,
  swapLocalePath,
  type Lang,
} from '../lib/locale';

export function useLocale() {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const locale: Lang = isLang(lang) ? lang : DEFAULT_LANG;

  const lp = useCallback(
    (path = '/') => localizedPath(locale, path),
    [locale],
  );

  const switchLocale = useCallback(() => {
    const newLang: Lang = locale === 'ar' ? 'en' : 'ar';
    navigate(swapLocalePath(location.pathname, newLang));
  }, [locale, location.pathname, navigate]);

  return { locale, lp, switchLocale };
}
