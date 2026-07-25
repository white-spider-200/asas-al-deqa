import React from "react";
import { motion } from "framer-motion";
import { Shield, Building2, Briefcase, Scale } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "../components/common/SEO";
import { Logo } from "../components/ui/Logo";

export const About = () => {
  const { t } = useTranslation();

  const strengths = [
    {
      title: t('about.strengths.tax.title'),
      desc: t('about.strengths.tax.desc'),
      icon: Scale,
    },
    {
      title: t('about.strengths.accounting.title'),
      desc: t('about.strengths.accounting.desc'),
      icon: Briefcase,
    },
    {
      title: t('about.strengths.sme.title'),
      desc: t('about.strengths.sme.desc'),
      icon: Building2,
    },
    {
      title: t('about.strengths.trusted.title'),
      desc: t('about.strengths.trusted.desc'),
      icon: Shield,
    },
  ];

  return (
    <div className="bg-background min-h-screen text-on-surface pt-20 font-sans selection:bg-primary selection:text-white">
      <SEO titleKey="seo.about_title" descriptionKey="seo.about_desc" />
    {/* Our Story Section */}
    <section className="about-main-intro px-6">
      <div className="max-w-container-max mx-auto grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="about-logo-showcase relative aspect-[4/3] bg-white border border-outline-variant flex items-center justify-center p-10 md:p-14 order-2 lg:order-1 overflow-hidden rounded-3xl shadow-sm"
        >
          <img 
            src="/images/about-office.jpg" 
            alt="Asas Al-Deqa" 
            className="absolute inset-0 w-full h-full object-cover opacity-[0.18]"
          />
          <div className="text-center space-y-6 relative z-10">
            <Logo showText={true} className="scale-150" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="about-intro-copy space-y-7 order-1 lg:order-2"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-on-surface leading-tight uppercase">
            {t('about.title.main')} <br />
            <span className="text-primary italic font-medium tracking-normal capitalize">{t('about.title.accent')}</span>
          </h2>
          <div className="space-y-5 text-muted text-base md:text-lg leading-relaxed font-medium">
            <p>
              {t('about.history_p1')}
            </p>
            <p>
              {t('about.history_p2')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Vision & Mission */}
    <section className="about-vision-final px-6 bg-white border-y border-outline-variant relative overflow-hidden about-vision-clean">
      <div className="max-w-container-max mx-auto grid md:grid-cols-2 gap-10 md:gap-14 text-center md:text-start relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="aspect-video mb-8 rounded-2xl overflow-hidden border border-outline-variant shadow-lg group">
            <img 
              src="/images/about-work.jpg" 
              alt={t('about.vision.title')} 
              className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-on-surface uppercase leading-tight">
              {t('about.vision.title')} <span className="text-primary italic font-medium tracking-normal">{t('about.vision.accent')}</span>
            </h2>
            <p className="text-muted text-base md:text-lg font-medium leading-relaxed">
              {t('about.vision.desc')}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="aspect-video mb-8 rounded-2xl overflow-hidden border border-outline-variant shadow-lg group">
            <img 
              src="/images/about-mission.jpg" 
              alt={t('about.mission.title')} 
              className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-on-surface uppercase leading-tight">
               {t('about.mission.title')} <span className="text-primary italic font-medium tracking-normal">{t('about.mission.accent')}</span>
            </h2>
            <p className="text-muted text-base md:text-lg font-medium leading-relaxed">
               {t('about.mission.desc')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Practice strengths — no fictional team portraits */}
    <section className="about-values-strip px-6">
      <div className="about-values-container">
        <div className="about-values-head">
          <h2>{t('about.strengths_title')}</h2>
          <p>{t('about.strengths_subtitle')}</p>
        </div>

        <div className="about-values-grid">
          {strengths.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="about-value-mini-card"
              >
                <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F3F9] text-[#005F93]">
                  <Icon size={22} strokeWidth={2.25} aria-hidden />
                </span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* Compact Values Strip */}
    <section className="about-values-strip px-6 pb-16">
      <div className="about-values-container">
        <div className="about-values-head">
          <h2>{t('about.why_title')}</h2>
          <p>{t('about.why_subtitle')}</p>
        </div>

        <div className="about-values-grid">
          {[
            {
              id: '01',
              title: t('about.pillars.commitment'),
              content: t('about.pillars.commitment_desc'),
            },
            {
              id: '02',
              title: t('about.pillars.legality'),
              content: t('about.pillars.legality_desc'),
            },
            {
              id: '03',
              title: t('about.pillars.quality'),
              content: t('about.pillars.quality_desc'),
            },
            {
              id: '04',
              title: t('about.pillars.confidentiality'),
              content: t('about.pillars.confidentiality_desc'),
            },
          ].map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="about-value-mini-card"
            >
              <span>{pillar.id}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    </div>
  );
};
