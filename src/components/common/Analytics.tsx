import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function ensureGtag(): void {
  if (!MEASUREMENT_ID || typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function trackPageView(path: string): void {
  if (!MEASUREMENT_ID || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Loads GA4 only when VITE_GA_MEASUREMENT_ID is set; tracks SPA navigations. */
export function Analytics() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!MEASUREMENT_ID) return;
    ensureGtag();
  }, []);

  useEffect(() => {
    if (!MEASUREMENT_ID) return;
    ensureGtag();
    trackPageView(`${pathname}${search}`);
  }, [pathname, search]);

  return null;
}
