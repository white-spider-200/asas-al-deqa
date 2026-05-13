import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Logo } from '../ui/Logo';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-16 bg-[#12212E] text-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-start">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-black tracking-tight text-[#005F93]">أساس الدقة / ADBS</span>
              <p className="text-white/40 text-sm leading-relaxed mt-4 max-w-xs">
                {t('footer.desc')}
              </p>
            </div>
          </div>

          {/* Links Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-black tracking-widest uppercase text-[#005F93] mb-2">{t('nav.services')}</h4>
            <nav className="flex flex-col gap-3 text-sm font-bold text-white/60">
              <Link to="/" className="hover:text-white transition-colors">{t('nav.home')}</Link>
              <Link to="/services" className="hover:text-white transition-colors">{t('nav.services')}</Link>
              <Link to="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link>
              <Link to="/contact" className="hover:text-white transition-colors font-black text-[#005F93]">{t('nav.contact')}</Link>
            </nav>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-black tracking-widest uppercase text-[#005F93] mb-2">{t('footer.legal')}</h4>
            <nav className="flex flex-col gap-3 text-sm font-bold text-white/60">
              <Link to="#" className="hover:text-white transition-colors">{t('footer.privacy')}</Link>
              <Link to="#" className="hover:text-white transition-colors">{t('footer.terms')}</Link>
            </nav>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/20 font-bold tracking-widest uppercase">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};
