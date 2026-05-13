import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ScrollToTop } from '../ui/ScrollToTop';

export const Layout = () => {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRtl, i18n.language]);

  return (
    <div 
      className={`min-h-screen flex flex-col selection:bg-primary/30 selection:text-primary ${isRtl ? 'font-arabic' : 'font-sans'}`} 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <Navbar />
      <main className="flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
