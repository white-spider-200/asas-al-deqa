import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/common/SEO';
import { cn } from '../lib/utils';

export const Contact = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const contactInfo = [
    {
      id: '01',
      title: t('contact.location'),
      value: t('contact.location_val'),
      icon: MapPin,
    },
    {
      id: '02',
      title: t('contact.phone'),
      value: t('contact.phone_val'),
      icon: Phone,
    },
    {
      id: '03',
      title: t('contact.email'),
      value: t('contact.email_val'),
      icon: Mail,
    },
    {
      id: '04',
      title: t('contact.hours'),
      value: t('contact.hours_val'),
      icon: Clock,
    },
  ];

  return (
    <div className="bg-[#F3F6F8] min-h-screen text-[#12212E] pt-24 font-sans selection:bg-[#005F93] selection:text-white overflow-hidden relative">
      <SEO titleKey="seo.contact_title" descriptionKey="seo.contact_desc" />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#E8F3F9] to-transparent opacity-60 z-0" />
      <div className="absolute top-40 -left-20 w-96 h-96 bg-[#005F93]/5 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#005F93]/5 rounded-full blur-3xl z-0" />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">
          
          {/* LEFT SIDE: Heading & Info */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-12 md:space-y-16"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[1.1] uppercase text-[#12212E]">
                  {t('contact.hero_title.main')} <br />
                  <span className="text-[#005F93]">{t('contact.hero_title.accent')}</span>
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-[#6B7280] text-lg md:text-xl font-medium leading-relaxed max-w-xl"
              >
                {t('contact.hero_subtitle')}
              </motion.p>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {contactInfo.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,95,147,0.08)" }}
                  className="bg-white p-6 md:p-8 rounded-[18px] border border-[#DCE3E8] shadow-[0_8px_20px_rgba(0,95,147,0.04)] transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F3F9] flex items-center justify-center text-[#005F93] group-hover:bg-[#005F93] group-hover:text-white transition-all duration-500">
                      <item.icon size={20} />
                    </div>
                    <span className="text-sm font-black text-[#005F93] uppercase tracking-wider">{item.title}</span>
                  </div>
                  <div className="text-[#12212E] text-sm md:text-base font-semibold leading-relaxed whitespace-pre-line">
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Privacy Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="p-6 md:p-8 bg-[#E8F3F9] rounded-2xl flex items-center gap-6 border border-[#005F93]/20"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#005F93] shadow-sm shrink-0">
                <ShieldCheck size={24} />
              </div>
              <p className="text-sm text-[#005F93] leading-relaxed font-bold">
                {t('contact.confidentiality')}
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE: Form Card */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="bg-white rounded-[24px] shadow-[0_30px_100px_rgba(18,33,46,0.08)] border border-[#DCE3E8] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#005F93]" />
              
              <div className="p-8 md:p-12 xl:p-16 space-y-10">
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-black text-[#12212E] uppercase tracking-tight">
                    {t('contact.form_title')}
                  </h3>
                  <p className="text-[#6B7280] text-base font-medium">
                    {t('contact.form_subtitle')}
                  </p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#12212E]/60 tracking-widest uppercase px-1">
                      {t('contact.label_name')}
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-[#F3F6F8] border border-[#DCE3E8] px-6 py-4 rounded-[14px] focus:outline-none focus:border-[#005F93] focus:ring-4 focus:ring-[#005F93]/5 transition-all text-[#12212E] font-semibold placeholder-[#6B7280]/40"
                      placeholder={t('contact.placeholder_name')}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#12212E]/60 tracking-widest uppercase px-1">
                      {t('contact.label_email')}
                    </label>
                    <input 
                      type="email" 
                      className="w-full bg-[#F3F6F8] border border-[#DCE3E8] px-6 py-4 rounded-[14px] focus:outline-none focus:border-[#005F93] focus:ring-4 focus:ring-[#005F93]/5 transition-all text-[#12212E] font-semibold placeholder-[#6B7280]/40"
                      placeholder={t('contact.placeholder_email')}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#12212E]/60 tracking-widest uppercase px-1">
                      {t('contact.label_subject')}
                    </label>
                    <div className="relative group">
                      <select 
                        className="w-full bg-[#F3F6F8] border border-[#DCE3E8] px-6 py-4 rounded-[14px] focus:outline-none focus:border-[#005F93] focus:ring-4 focus:ring-[#005F93]/5 transition-all text-[#12212E] appearance-none cursor-pointer font-semibold"
                      >
                        <option>{t('services.items.tax_compliance')}</option>
                        <option>{t('services.items.accounting')}</option>
                        <option>{t('services.items.tax_litigation')}</option>
                        <option>{t('services.items.erp')}</option>
                      </select>
                      <div className={cn("absolute top-1/2 -translate-y-1/2 pointer-events-none text-[#005F93]", isRtl ? "left-6" : "right-6")}>
                        <ChevronRight className={cn("rotate-90 transition-transform group-focus-within:-rotate-90")} size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#12212E]/60 tracking-widest uppercase px-1">
                      {t('contact.label_message')}
                    </label>
                    <textarea 
                      rows={3}
                      className="w-full bg-[#F3F6F8] border border-[#DCE3E8] px-6 py-4 rounded-[14px] focus:outline-none focus:border-[#005F93] focus:ring-4 focus:ring-[#005F93]/5 transition-all text-[#12212E] resize-none font-semibold leading-relaxed placeholder-[#6B7280]/40"
                      placeholder={t('contact.placeholder_message')}
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#005F93] text-white py-5 rounded-[14px] font-bold text-base flex items-center justify-center gap-3 hover:bg-[#004B75] transition-all shadow-lg shadow-[#005F93]/15 active:scale-[0.98] group"
                  >
                    {t('contact.button_send')}
                    <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Strip */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24 md:mt-32 pt-12 border-t border-[#DCE3E8] flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 lg:gap-24"
        >
          {[
            { label: t('contact.trust.privacy'), icon: ShieldCheck },
            { label: t('contact.trust.response'), icon: Clock },
            { label: t('contact.trust.custom'), icon: CheckCircle2 },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 text-[#12212E]">
              <div className="w-8 h-8 rounded-full bg-[#005F93]/10 flex items-center justify-center text-[#005F93]">
                <item.icon size={16} />
              </div>
              <span className="text-sm md:text-base font-bold uppercase tracking-tight">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

