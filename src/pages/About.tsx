import React from "react";
import { motion } from "framer-motion";
import { Shield, Building2, Cpu, Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "../components/common/SEO";
import { Logo } from "../components/ui/Logo";

const experts = [
  {
    name: "Omar Tariq",
    title: "SENIOR TAX ADVISOR",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
    bio: "Over 15 years navigating complex regional tax structures and cross-border compliance.",
  },
  {
    name: "Leila Haddad",
    title: "LEAD ACCOUNTANT",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    bio: "Specializes in institutional audit preparation and forensic accounting for high-net-worth portfolios.",
  },
  {
    name: "Tarek Al-Fayed",
    title: "MANAGING PARTNER",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
    bio: "Former Big Four executive directing our strategic advisory and corporate restructuring practice.",
  },
];

export const About = () => {
  const { t } = useTranslation();

  const sectors = [
    {
      title: t('about.sectors.manufacturing'),
      desc: t('about.history_p2'),
      icon: Building2,
    },
    {
      title: t('about.sectors.financial'),
      desc: t('about.history_p2'),
      icon: Shield,
    },
    {
      title: t('about.sectors.trading'),
      desc: t('about.history_p2'),
      icon: Briefcase,
    },
    {
      title: t('about.sectors.telecom'),
      desc: t('about.history_p2'),
      icon: Cpu,
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
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop" 
            alt="Corporate Heritage" 
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
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop" 
              alt="Our Vision" 
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
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop" 
              alt="Our Mission" 
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

    {/* Compact Values Strip */}
    <section className="about-values-strip px-6">
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

      {/* experts and sectors omitted for brevity or simplified translation */}
    </div>
  );
};
