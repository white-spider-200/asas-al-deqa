import React from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Users, Landmark, ArrowRight, ArrowLeft, CheckCircle2, BarChart3, Briefcase, Lightbulb, Building2, TrendingUp } from 'lucide-react';
import { CinematicHeroV2 } from '../components/ui/CinematicHeroV2';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/common/SEO';
import { Logo } from '../components/ui/Logo';


export const Home = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <main className="bg-background min-h-screen selection:bg-primary selection:text-white antialiased">
      <SEO titleKey="seo.home_title" descriptionKey="seo.home_desc" />
      <CinematicHeroV2 />

      {/* Services Grid Section */}
      <section className="py-24 md:py-32 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black text-on-surface tracking-tight"
            >
              {t('home.services_title.main')} <span className="text-primary tracking-normal font-medium italic">{t('home.services_title.accent')}</span> {t('home.services_title.suffix')}
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: t('home.services.formation.title'), 
                desc: t('home.services.formation.desc'),
                icon: Building2 
              },
              { 
                title: t('home.services.management.title'), 
                desc: t('home.services.management.desc'),
                icon: Briefcase 
              },
              { 
                title: t('home.services.tax.title'), 
                desc: t('home.services.tax.desc'),
                icon: BarChart3 
              },
              { 
                title: t('home.services.development.title'), 
                desc: t('home.services.development.desc'),
                icon: TrendingUp 
              },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="h-full bg-white border border-outline-variant p-8 rounded-2xl shadow-sm hover:shadow-[0_20px_40px_rgba(0,95,147,0.08)] hover:border-primary/20 transition-all duration-500 group-hover:-translate-y-2 flex flex-col items-start">
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <service.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-on-surface mb-4 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed mb-6 flex-grow">
                    {service.desc}
                  </p>
                  <Link to="/services" className="text-primary text-[11px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 group-hover:gap-3 transition-all">
                    {t('home.services.view_details')}
                    {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 md:py-32 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">

                <h2 className="text-3xl md:text-5xl font-black text-on-surface leading-tight">
                  {t('home.why.title.p1')} <span className="text-primary italic font-medium">{t('home.why.title.accent')}</span> {t('home.why.title.p2')}
                </h2>
              </div>
              
              <div className="grid gap-6">
                {[
                  { title: t('home.why.items.precision'), desc: t('home.why.items.precision_desc') },
                  { title: t('home.why.items.custom'), desc: t('home.why.items.custom_desc') },
                  { title: t('home.why.items.expertise'), desc: t('home.why.items.expertise_desc') },
                  { title: t('home.why.items.integrity'), desc: t('home.why.items.integrity_desc') },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-white rounded-xl border border-outline-variant shadow-sm">
                    <CheckCircle2 className="text-primary shrink-0" size={24} />
                    <div>
                      <h4 className="text-on-surface font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
                  alt="Boardroom Meeting" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-40 px-6 relative overflow-hidden bg-white border-y border-outline-variant">
        <div className="absolute inset-0 bg-secondary/30 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tight text-on-surface leading-tight"
          >
            {t('services.cta_title')}
          </motion.h2>
          <p className="text-muted text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link 
              to="/contact" 
              className="w-full sm:w-auto bg-primary text-white px-12 py-5 font-bold hover:bg-primary-container transition-all text-sm tracking-tight rounded-xl shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-3 group"
            >
              {t('services.cta_button')}
              {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </Link>
            <Link 
              to="/about" 
              className="w-full sm:w-auto px-12 py-5 border-2 border-outline-variant text-on-surface font-bold hover:bg-background transition-all text-sm tracking-tight rounded-xl text-center"
            >
              {t('nav.about')}
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
};
