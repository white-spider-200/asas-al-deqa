import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, Languages, Home as HomeIcon, Info, Briefcase, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../../hooks/useLocale';

import { Logo } from '../ui/Logo';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { lp, switchLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isRtl = i18n.language === 'ar';

  const navLinks = [
    { id: 'home', label: t('nav.home'), path: lp('/'), icon: HomeIcon },
    { id: 'about', label: t('nav.about'), path: lp('/about'), icon: Info },
    { id: 'services', label: t('nav.services'), path: lp('/services'), icon: Briefcase },
    { id: 'contact', label: t('nav.contact'), path: lp('/contact'), icon: MessageSquare },
  ];

  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => {
    if (path.endsWith('/ar') || path.endsWith('/en')) {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-gray-100'
          : 'bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-gray-100'
      )}
    >
      <div className="max-w-container-max mx-auto flex items-center justify-between px-6 md:px-12 lg:grid lg:grid-cols-[minmax(180px,1fr)_auto_minmax(300px,1fr)] lg:gap-6 xl:gap-10">
        <div className="flex-shrink-0 justify-self-start">
          <Link to={lp('/')} className="flex items-center">
            <Logo showText={true} className={cn('scale-150 lg:scale-[1.85]', isRtl ? 'origin-right' : 'origin-left')} />
          </Link>
        </div>

        <div className="hidden justify-self-center lg:flex">
          <div className="flex items-center gap-5 xl:gap-8">
            {navLinks
              .filter((link) => link.id !== 'home')
              .map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.id}
                    to={link.path}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group relative whitespace-nowrap px-2 py-2 text-sm font-bold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005F93]/30 focus-visible:ring-offset-4',
                      active ? 'text-[#005F93]' : 'text-[#4B5563] hover:text-[#005F93]'
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#005F93] rounded-full"
                      />
                    )}
                    {!active && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#005F93]/40 rounded-full group-hover:w-4 transition-all" />
                    )}
                  </Link>
                );
              })}
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-end gap-8 justify-self-end">
          <button
            onClick={switchLocale}
            className="text-[11px] font-black tracking-widest text-[#12212E]/60 hover:text-[#005F93] transition-colors uppercase flex items-center gap-1.5"
          >
            <Languages size={14} className="text-[#005F93]" />
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </button>

          <Link
            to={lp('/contact')}
            className="navbar-consultation-btn bg-[#005F93] text-white px-8 py-3 text-[19px] font-bold hover:bg-[#004B75] transition-all tracking-tight uppercase rounded-xl shadow-md hover:shadow-lg active:scale-95"
          >
            {t('services.cta_button')}
          </Link>
        </div>

        <div className="flex items-center gap-4 lg:hidden justify-self-end">
          <button
            onClick={switchLocale}
            className="text-[12px] font-black tracking-widest text-[#005F93] uppercase px-2 py-1 bg-[#005F93]/5 rounded-md"
          >
            {i18n.language === 'en' ? 'AR' : 'EN'}
          </button>
          <button
            className="text-[#12212E] p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={t('nav_labels.navigation')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mobile-menu-panel fixed inset-0 z-[200] flex flex-col bg-white lg:hidden"
              >
              <div className="flex items-center justify-between border-b border-[#E8EDF2] px-6 py-5">
                <Logo showText={true} className={cn('scale-125', isRtl ? 'origin-right' : 'origin-left')} />
                <button
                  type="button"
                  className="rounded-xl p-2 text-[#12212E] transition-colors hover:bg-[#F4F7F9]"
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  <X size={26} />
                </button>
              </div>

              <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8">
                <span className="mb-4 px-1 text-[10px] font-black tracking-[0.28em] text-[#005F93]/70 uppercase">
                  {t('nav_labels.navigation')}
                </span>

                <div className="flex flex-col gap-3">
                  {navLinks.map((link) => {
                    const active = isActive(link.path);
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={closeMenu}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'mobile-nav-item group flex items-center gap-4 rounded-2xl border px-4 py-4 transition-colors duration-200 active:scale-[0.98]',
                          active
                            ? 'border-[#12212E] bg-[#12212E] shadow-[0_10px_28px_rgba(18,33,46,0.22)]'
                            : 'border-[#E8EDF2] bg-white hover:border-[#005F93]/25 hover:bg-[#F8FBFD] hover:shadow-sm'
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors',
                            active ? 'bg-white/15 text-white' : 'bg-[#E8F3F9] text-[#005F93] group-hover:bg-[#DCEEF7]'
                          )}
                        >
                          <Icon size={20} strokeWidth={2.25} aria-hidden />
                        </span>
                        <span
                          className={cn(
                            'mobile-nav-item-label flex-1 text-lg font-bold tracking-tight',
                            active ? 'text-white' : 'text-[#12212E]'
                          )}
                        >
                          {link.label}
                        </span>
                        <ChevronRight
                          className={cn(
                            'mobile-nav-item-chevron shrink-0',
                            isRtl ? 'rotate-180' : '',
                            active ? 'text-white/90' : 'text-[#12212E]/45 group-hover:text-[#005F93]'
                          )}
                          size={20}
                          strokeWidth={2.5}
                        />
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-auto space-y-6 pt-10">
                  <Link
                    to={lp('/contact')}
                    onClick={closeMenu}
                    className="navbar-consultation-btn flex w-full items-center justify-center gap-3 rounded-2xl bg-[#005F93] py-5 text-center text-lg font-black tracking-tight text-white uppercase shadow-[0_12px_28px_rgba(0,95,147,0.28)] transition-all hover:bg-[#004B75] active:scale-[0.98]"
                  >
                    {t('services.cta_button')}
                    <ChevronRight size={20} strokeWidth={2.5} className={cn(isRtl ? 'rotate-180' : '')} />
                  </Link>

                  <div className="flex items-center justify-between border-t border-[#E8EDF2] pt-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black tracking-widest text-[#94A3B8] uppercase">
                        {t('nav_labels.heritage')}
                      </span>
                      <span className="text-xs font-bold text-[#12212E]">ADBS © 2026</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        switchLocale();
                        closeMenu();
                      }}
                      className="flex items-center gap-2 rounded-xl border border-[#E8EDF2] bg-[#F8FBFD] px-4 py-2.5 text-[11px] font-black tracking-widest text-[#005F93] uppercase transition-colors hover:border-[#005F93]/20 hover:bg-[#E8F3F9]"
                    >
                      <Languages size={16} />
                      {i18n.language === 'en' ? 'العربية' : 'English'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </nav>
  );
};
