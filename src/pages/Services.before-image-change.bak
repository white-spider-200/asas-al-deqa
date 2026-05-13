import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldAlert, BarChart3, Landmark, PieChart, Briefcase, ChevronRight, Target, ClipboardCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { SEO } from '../components/common/SEO';

export const Services = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const servicesList = [
    {
      icon: <BarChart3 className="text-primary" size={32} />,
      title: t('services.items.tax_compliance'),
      desc: t('services.items.tax_compliance_desc'),
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=500&auto=format&fit=crop"
    },
    {
      icon: <Landmark className="text-primary" size={32} />,
      title: t('services.items.accounting'),
      desc: t('services.items.accounting_desc'),
      image: "https://images.unsplash.com/photo-1454165833767-027ffea9e778?q=80&w=500&auto=format&fit=crop"
    },
    {
      icon: <ShieldAlert className="text-primary" size={32} />,
      title: t('services.items.tax_management'),
      desc: t('services.items.tax_management_desc'),
      image: "https://images.unsplash.com/photo-1507679799987-c7377ec48696?q=80&w=500&auto=format&fit=crop"
    },
    {
      icon: <Briefcase className="text-primary" size={32} />,
      title: t('services.items.tax_litigation'),
      desc: t('services.items.tax_litigation_desc'),
      image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=500&auto=format&fit=crop"
    },
    {
      icon: <ClipboardCheck className="text-primary" size={32} />,
      title: t('services.items.documentation'),
      desc: t('services.items.documentation_desc'),
      image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=500&auto=format&fit=crop"
    },
    {
      icon: <TrendingUp className="text-primary" size={32} />,
      title: t('services.items.inventory'),
      desc: t('services.items.inventory_desc'),
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=500&auto=format&fit=crop"
    },
    {
      icon: <Zap className="text-primary" size={32} />,
      title: t('services.items.erp'),
      desc: t('services.items.erp_desc'),
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop"
    }
  ];

  return (
    <div className="bg-background min-h-screen text-on-surface pt-20 font-sans selection:bg-primary selection:text-white">
      <SEO titleKey="seo.services_title" descriptionKey="seo.services_desc" />
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden border-b border-outline-variant bg-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
            alt="Modern Office" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>
        
        <div className="max-w-container-max mx-auto px-6 relative z-10 w-full py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-6 md:mb-8 leading-[1.1] uppercase text-on-surface">
              {t('services.title.main')} <span className="text-primary">{t('services.title.accent')}</span>
            </h1>
            <p className="text-muted text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
              {t('services.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white border border-outline-variant p-10 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 flex flex-col items-start"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                  {s.icon}
                </div>
                <h3 className="text-2xl font-black text-on-surface mb-4 uppercase tracking-tight group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-muted leading-relaxed text-sm md:text-base font-medium mb-10 flex-grow">
                  {s.desc}
                </p>
                <Link to="/contact" className="mt-auto flex items-center gap-3 text-[11px] font-black tracking-[0.2em] text-primary hover:gap-5 transition-all uppercase">
                  {t('services.cta_button')} <ChevronRight className={cn(isRtl ? "rotate-180" : "")} size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-24 md:py-32 bg-[#F3F6F8] px-6 border-y border-[#DCE3E8] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-3xl md:text-6xl font-black tracking-tight text-[#12212E] uppercase leading-tight">{t('about.why_title')}</h2>
             <p className="text-[#6B7280] text-lg md:text-xl font-medium">
               {t('about.why_subtitle')}
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {[
              { id: '01', title: t('about.pillars.commitment'), desc: t('about.pillars.commitment_desc'), icon: ClipboardCheck },
              { id: '02', title: t('about.pillars.legality'), desc: t('about.pillars.legality_desc'), icon: Target },
              { id: '03', title: t('about.pillars.quality'), desc: t('about.pillars.quality_desc'), icon: Zap },
              { id: '04', title: t('about.pillars.confidentiality'), desc: t('about.pillars.confidentiality_desc'), icon: Briefcase }
            ].map((pillar, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="group p-8 md:p-12 bg-white rounded-[18px] border-t-2 border-[#005F93] border-l border-r border-b border-[#DCE3E8] shadow-[0_10px_30px_rgba(0,95,147,0.05)] hover:shadow-[0_20px_50px_rgba(0,95,147,0.12)] transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 text-9xl font-black text-[#005F93]/5 select-none transition-colors group-hover:text-[#005F93]/10">
                  {pillar.id}
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-black text-[#005F93]">
                      {pillar.id}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#F3F6F8] flex items-center justify-center text-[#005F93] group-hover:bg-[#005F93] group-hover:text-white transition-all duration-500">
                      <pillar.icon size={24} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-black text-[#12212E] uppercase tracking-tight group-hover:text-[#005F93] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-[#6B7280] text-sm md:text-base font-medium leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-40 px-6">
         <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-4xl md:text-7xl font-black text-on-surface tracking-tight uppercase leading-tight">
               {t('services.cta_title')}
            </h2>
            <Link to="/contact" className="inline-block bg-primary text-white px-12 md:px-16 py-5 font-bold text-[12px] tracking-[0.2em] uppercase hover:bg-primary-container transition-all rounded-xl shadow-[0_10px_20px_rgba(0,95,147,0.22)] w-full sm:w-auto">
               {t('services.cta_button')}
            </Link>
         </div>
      </section>
    </div>
  );
};

