import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, Languages } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

import { Logo } from '../ui/Logo';
import { LimelightNav } from '../ui/limelight-nav';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { id: 'home', label: t('nav.home'), path: '/' },
    { id: 'services', label: t('nav.services'), path: '/services' },
    { id: 'about', label: t('nav.about'), path: '/about' },
    { id: 'contact', label: t('nav.contact'), path: '/contact' },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled 
          ? 'bg-white/90 backdrop-blur-md py-3 shadow-sm border-b border-outline-variant' 
          : 'bg-transparent py-5 border-b border-transparent'
      )}
    >
      <div className="max-w-container-max mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo/Brand - Positioned based on direction */}
        <div className="flex-shrink-0 lg:w-1/4">
          <Link to="/" className="flex items-center">
            <Logo showText={true} className="scale-100" />
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex flex-grow justify-center">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.id}
                  to={link.path}
                  className={cn(
                    "px-5 py-2 text-sm font-bold tracking-tight transition-all relative group focus:outline-none focus:ring-0",
                    isActive ? "text-[#005F93]" : "text-on-surface/70 hover:text-[#005F93]"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#005F93] rounded-full"
                    />
                  )}
                  {!isActive && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#005F93]/40 rounded-full group-hover:w-4 transition-all" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Actions - Right side (Left side in RTL) */}
        <div className="hidden lg:flex items-center justify-end gap-6 lg:w-1/4">
          <button 
            onClick={toggleLanguage}
            className="text-[11px] font-black tracking-widest text-on-surface/60 hover:text-primary transition-colors uppercase flex items-center gap-1.5"
          >
            <Languages size={14} className="text-primary" />
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </button>

          <Link
            to="/contact"
            className="bg-primary text-white px-7 py-3 text-[12px] font-bold hover:bg-primary-container transition-all tracking-tight uppercase rounded-lg shadow-md hover:shadow-lg active:scale-95"
          >
            {t('services.cta_button')}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <button 
            onClick={toggleLanguage}
            className="text-[11px] font-black tracking-widest text-primary uppercase"
          >
            {i18n.language === 'en' ? 'AR' : 'EN'}
          </button>
          <button
            className="text-on-surface p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: i18n.language === 'ar' ? '-100%' : '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: i18n.language === 'ar' ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-background z-[60] flex flex-col p-8 pt-24 gap-6"
          >
            <button
              className="absolute top-6 right-6 p-2 text-on-surface"
              onClick={() => setIsOpen(false)}
            >
              <X size={32} />
            </button>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-[0.5em] text-primary uppercase mb-4">{t('nav_labels.navigation')}</span>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'text-4xl font-noto-serif font-bold py-4 flex justify-between items-center group',
                    location.pathname === link.path ? 'text-primary' : 'text-on-surface/40 hover:text-on-surface'
                  )}
                >
                  {link.label}
                  <ChevronRight className={cn(i18n.language === 'ar' ? 'rotate-180' : '', "text-primary opacity-0 group-hover:opacity-100 transition-opacity")} />
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-6">
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="bg-primary text-white text-center py-5 text-sm font-bold tracking-[0.2em] uppercase rounded-sm"
              >
                {t('services.cta_button')}
              </Link>
              
              <div className="flex items-center justify-between pt-6 border-t border-outline/10">
                 <span className="text-[10px] font-bold tracking-widest text-on-surface/20 uppercase">{t('nav_labels.heritage')}</span>
                 <button 
                  onClick={() => {
                    toggleLanguage();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-primary uppercase"
                >
                  <Languages size={16} />
                  {i18n.language === 'en' ? t('nav_labels.arabic') : t('nav_labels.english')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
