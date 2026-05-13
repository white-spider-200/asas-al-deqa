import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

import { useTranslation } from 'react-i18next';

export const ScrollToTop = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className={`fixed bottom-8 ${isRtl ? 'left-8' : 'right-8'} z-50 p-4 bg-primary text-black rounded-full shadow-lg hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black`}
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
