import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, Languages, Home as HomeIcon, Info, Briefcase, MessageSquare, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

import { Logo } from '../ui/Logo';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { id: 'home', label: t('nav.home'), path: '/', icon: HomeIcon },
    { id: 'about', label: t('nav.about'), path: '/about', icon: Info },
    { id: 'services', label: t('nav.services'), path: '/services', icon: Briefcase },
    { id: 'contact', label: t('nav.contact'), path: '/contact', icon: MessageSquare },
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
          ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-gray-100' 
          : 'bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-gray-100'
      )}
    >
      <div className="max-w-container-max mx-auto px-6 md:px-12 grid grid-cols-[1fr_auto_1fr] items-center gap-8">
        {/* Logo/Brand */}
        <div className="flex-shrink-0 justify-self-start">
          <Link to="/" className="flex items-center">
            <Logo showText={true} className="scale-150 lg:scale-[1.85] origin-right" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex justify-self-center justify-center">
          <div className="flex items-center gap-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.id}
                  to={link.path}
                  className={cn(
                    "px-5 py-2 text-sm font-bold tracking-tight transition-all relative group focus:outline-none focus:ring-0",
                    isActive ? "text-[#005F93]" : "text-[#4B5563] hover:text-[#005F93]"
                  )}
                >
                  {link.id === 'home' ? (
                    <HomeIcon size={21} strokeWidth={2.5} aria-label={link.label} />
                  ) : (
                    link.label
                  )}
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

        {/* Actions */}
        <div className="hidden lg:flex items-center justify-end gap-8 justify-self-end">
          <button 
            onClick={toggleLanguage}
            className="text-[11px] font-black tracking-widest text-[#12212E]/60 hover:text-[#005F93] transition-colors uppercase flex items-center gap-1.5"
          >
            <Languages size={14} className="text-[#005F93]" />
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </button>

          <Link
            to="/contact"
            className="bg-[#005F93] text-white px-8 py-3 text-[19px] font-bold hover:bg-[#004B75] transition-all tracking-tight uppercase rounded-xl shadow-md hover:shadow-lg active:scale-95"
          >
            {t('services.cta_button')}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden justify-self-end">
          <button 
            onClick={toggleLanguage}
            className="text-[12px] font-black tracking-widest text-[#005F93] uppercase px-2 py-1 bg-[#005F93]/5 rounded-md"
          >
            {i18n.language === 'en' ? 'AR' : 'EN'}
          </button>
          <button
            className="text-[#12212E] p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 bg-white z-[60] flex flex-col p-8 pt-24"
          >
            <div className="flex items-center justify-between absolute top-0 left-0 right-0 p-6 bg-white border-b border-gray-100">
              <Logo showText={true} className="scale-125 origin-left" />
              <button
                className="p-2 text-[#12212E]"
                onClick={() => setIsOpen(false)}
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex flex-col gap-4 mt-8 px-2">
              <span className="text-[11px] font-black tracking-[0.3em] text-[#005F93] uppercase mb-2 px-4 opacity-60">
                {t('nav_labels.navigation')}
              </span>
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'text-xl font-bold py-5 px-6 flex items-center justify-between transition-all rounded-2xl border-2',
                        isActive 
                          ? 'bg-black text-white border-black shadow-lg shadow-black/20' 
                          : 'bg-gray-50 text-[#12212E] border-transparent hover:bg-gray-100 hover:border-gray-200'
                      )}
                    >
                      <span className="tracking-tight">
                        {link.id === 'home' ? t('nav.home') : link.label}
                      </span>
                      <ChevronRight 
                        className={cn(
                          "transition-transform",
                          i18n.language === 'ar' ? 'rotate-180' : '',
                          isActive ? 'text-white' : 'text-gray-400'
                        )} 
                        size={20}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-auto space-y-8 pb-10">
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="w-full bg-black text-white text-center py-5 text-xl font-black tracking-tight uppercase rounded-2xl shadow-lg shadow-black/20 flex items-center justify-center gap-3 active:scale-95 transition-transform"
              >
                {t('services.cta_button')}
                <ChevronRight size={20} className={cn(i18n.language === 'ar' ? 'rotate-180' : '')} />
              </Link>
              
              <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                 <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                     {t('nav_labels.heritage')}
                   </span>
                   <span className="text-xs font-bold text-[#12212E]">ADBS © 2026</span>
                 </div>
                 
                 <button 
                  onClick={() => {
                    toggleLanguage();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-[12px] font-black tracking-widest text-[#005F93] uppercase transition-colors hover:bg-gray-100"
                >
                  <Languages size={16} />
                  {i18n.language === 'en' ? 'العربية' : 'English'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
