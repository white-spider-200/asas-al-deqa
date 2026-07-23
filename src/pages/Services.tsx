import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldAlert, BarChart3, Landmark, Briefcase, ChevronRight, ClipboardCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { SEO } from '../components/common/SEO';
import { FAQSection } from '../components/common/FAQSection';
import { useLocale } from '../hooks/useLocale';
import type { ServiceSlug } from '../lib/services';

export const Services = () => {
  const { t, i18n } = useTranslation();
  const { lp } = useLocale();
  const isRtl = i18n.language === 'ar';

  const faqItems = useMemo(
    () => t('faq.items', { returnObjects: true }) as { q: string; a: string }[],
    [t],
  );

  const servicesList: {
    slug: ServiceSlug;
    icon: React.ReactNode;
    title: string;
    desc: string;
    image: string;
  }[] = [
    {
      slug: 'tax-compliance',
      icon: <BarChart3 className="text-primary" size={32} />,
      title: t('services.items.tax_compliance'),
      desc: t('services.items.tax_compliance_desc'),
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=500&auto=format&fit=crop',
    },
    {
      slug: 'accounting',
      icon: <Landmark className="text-primary" size={32} />,
      title: t('services.items.accounting'),
      desc: t('services.items.accounting_desc'),
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=500&auto=format&fit=crop',
    },
    {
      slug: 'tax-management',
      icon: <ShieldAlert className="text-primary" size={32} />,
      title: t('services.items.tax_management'),
      desc: t('services.items.tax_management_desc'),
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=500&auto=format&fit=crop',
    },
    {
      slug: 'tax-litigation',
      icon: <Briefcase className="text-primary" size={32} />,
      title: t('services.items.tax_litigation'),
      desc: t('services.items.tax_litigation_desc'),
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=500&auto=format&fit=crop',
    },
    {
      slug: 'documentation',
      icon: <ClipboardCheck className="text-primary" size={32} />,
      title: t('services.items.documentation'),
      desc: t('services.items.documentation_desc'),
      image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=500&auto=format&fit=crop',
    },
    {
      slug: 'inventory',
      icon: <TrendingUp className="text-primary" size={32} />,
      title: t('services.items.inventory'),
      desc: t('services.items.inventory_desc'),
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&auto=format&fit=crop',
    },
    {
      slug: 'erp',
      icon: <Zap className="text-primary" size={32} />,
      title: t('services.items.erp'),
      desc: t('services.items.erp_desc'),
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop',
    },
  ];

  return (
    <div className="bg-background min-h-screen text-on-surface pt-20 font-sans selection:bg-primary selection:text-white">
      <SEO titleKey="seo.services_title" descriptionKey="seo.services_desc" faqItems={faqItems} />

      <section className="relative min-h-[38vh] flex items-center overflow-hidden border-b border-outline-variant bg-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop"
            alt={isRtl ? 'مكتب حديث لاستشارات ضريبية ومحاسبية' : 'Modern office for tax and accounting consultancy'}
            width={2069}
            height={1200}
            fetchPriority="high"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>

        <div className="max-w-container-max mx-auto px-6 relative z-10 w-full py-14 md:py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-5 leading-[1.08] uppercase text-on-surface">
              {t('services.title.main')} <span className="text-primary">{t('services.title.accent')}</span>
            </h1>
            <p className="text-muted text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              {t('services.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-6">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 services-balanced-grid">
            {servicesList.map((s, i) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  'group bg-white border border-outline-variant p-7 md:p-8 rounded-[1.6rem] shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 flex flex-col items-start min-h-[330px]',
                  i === servicesList.length - 1 ? 'lg:col-span-3 lg:max-w-[520px] lg:mx-auto' : '',
                )}
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                  {s.icon}
                </div>
                <Link to={lp(`/services/${s.slug}`)}>
                  <h3 className="text-xl md:text-2xl font-black text-on-surface mb-3 uppercase tracking-tight group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                </Link>
                <p className="text-muted leading-relaxed text-sm font-medium mb-7 flex-grow">{s.desc}</p>
                <div className="mt-auto flex flex-col gap-3 w-full">
                  <Link
                    to={lp(`/services/${s.slug}`)}
                    className="flex items-center gap-3 text-[11px] font-black tracking-[0.2em] text-on-surface hover:text-primary transition-all uppercase"
                  >
                    {isRtl ? 'عرض التفاصيل' : 'View details'}
                    <ChevronRight className={cn(isRtl ? 'rotate-180' : '')} size={16} />
                  </Link>
                  <Link
                    to={lp('/contact')}
                    className="flex items-center gap-3 text-[11px] font-black tracking-[0.2em] text-primary hover:gap-5 transition-all uppercase"
                  >
                    {t('services.cta_button')}
                    <ChevronRight className={cn(isRtl ? 'rotate-180' : '')} size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection
        title={t('faq.section_title')}
        subtitle={t('faq.section_subtitle')}
        items={faqItems}
        className="bg-[#F3F6F8] border-t border-outline-variant"
      />

      <section className="services-final-cta px-6">
        <div className="services-final-cta-card">
          <div>
            <h2>
              {isRtl
                ? 'حلول مهنية تبدأ من احتياج عملك'
                : 'Professional solutions built around your business needs'}
            </h2>
            <p>
              {isRtl
                ? 'اختر الخدمة المناسبة لمرحلة شركتك، ودع فريق أساس الدقة يساعدك في تنظيم أعمالك المالية والضريبية بثقة ووضوح.'
                : 'Choose the service that fits your company stage, and let ADBS help organize your financial and tax operations with confidence and clarity.'}
            </p>
          </div>

          <Link to={lp('/contact')} className="services-final-cta-button">
            {t('services.cta_button')}
          </Link>
        </div>
      </section>
    </div>
  );
};
