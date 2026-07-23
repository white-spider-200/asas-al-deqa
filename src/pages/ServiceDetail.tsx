import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/common/SEO';
import { FAQSection } from '../components/common/FAQSection';
import { useLocale } from '../hooks/useLocale';
import { isServiceSlug, SLUG_TO_I18N_KEY } from '../lib/services';
import { cn } from '../lib/utils';

export const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { lp } = useLocale();
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    if (!isServiceSlug(slug)) {
      navigate(lp('/services'), { replace: true });
    }
  }, [slug, navigate, lp]);

  if (!isServiceSlug(slug)) {
    return null;
  }

  const key = SLUG_TO_I18N_KEY[slug];
  const base = `service_detail.${key}`;
  const title = t(`${base}.seo_title`);
  const description = t(`${base}.seo_desc`);
  const benefits = t(`${base}.benefits`, { returnObjects: true }) as string[];
  const faqItems = t(`${base}.faq`, { returnObjects: true }) as { q: string; a: string }[];

  return (
    <div className="bg-background min-h-screen text-on-surface pt-20 font-sans selection:bg-primary selection:text-white">
      <SEO title={title} description={description} faqItems={faqItems} />

      <section className="relative border-b border-outline-variant bg-white">
        <div className="max-w-container-max mx-auto px-6 py-14 md:py-20">
          <Link
            to={lp('/services')}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-8 hover:gap-3 transition-all"
          >
            <ChevronRight size={14} className={cn(isRtl ? '' : 'rotate-180')} />
            {t('service_detail.back')}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-tight text-on-surface mb-6">
              {t(`${base}.h1`)}
            </h1>
            <p className="text-muted text-lg md:text-xl font-medium leading-relaxed mb-6">
              {t(`${base}.intro`)}
            </p>
            <p className="text-muted text-base md:text-lg font-medium leading-relaxed">
              {t(`${base}.body`)}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-6">
        <div className="max-w-container-max mx-auto">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-on-surface mb-8">
            {t('service_detail.benefits_title')}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 bg-white border border-outline-variant rounded-2xl p-5 shadow-sm"
              >
                <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                <span className="text-sm md:text-base font-medium text-on-surface leading-relaxed">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FAQSection
        title={t('service_detail.faq_title')}
        items={faqItems}
        className="bg-[#F3F6F8]"
      />

      <section className="px-6 py-14 md:py-20">
        <div className="max-w-container-max mx-auto text-center bg-primary rounded-[2rem] px-8 py-14 md:py-16">
          <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-6">
            {t('service_detail.cta_title')}
          </h2>
          <Link
            to={lp('/contact')}
            className={cn(
              'inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-xl font-black uppercase tracking-tight text-sm hover:bg-[#E8F3F9] transition-colors shadow-lg'
            )}
          >
            {t('service_detail.cta_button')}
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};
