import React from "react";
import { motion } from 'motion/react';
import { cn } from "../../lib/utils";
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export function CinematicHeroV2({ className }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className={cn("relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-white", className)}>
      {/* Background Image with Professional Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2000&auto=format&fit=crop" 
          alt="Modern Business Office" 
          className="w-full h-full object-cover"
        />
        {/* The requested soft blue/white gradient overlay */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.95))'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10 pt-32 pb-20 flex justify-center">
        <div className="max-w-4xl w-full space-y-8 text-center flex flex-col items-center">


          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-4 w-full"
          >
            <h1 
              className="font-extrabold tracking-tight leading-[1.2] uppercase text-center"
              style={{ fontSize: 'clamp(38px, 6vw, 72px)' }}
            >
              <span className="text-[#12212E] block">
                {t('about.title.main')}
              </span>
              <span className="text-[#005F93] block">
                {t('about.title.accent')}
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#12212E]/80 text-base md:text-xl font-medium leading-relaxed max-w-3xl mx-auto text-center"
          >
            {t('about.subtitle')}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link 
              to="/contact" 
              className="bg-[#005F93] text-white px-12 py-5 rounded-xl font-bold text-sm tracking-tight shadow-[0_10px_20px_rgba(0,95,147,0.22)] hover:bg-[#004B75] hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 group"
            >
              {t('hero.cta_contact')}
              {isRtl ? (
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              )}
            </Link>
            
            <Link 
              to="/services" 
              className="bg-white text-[#005F93] border-2 border-[#005F93]/10 px-12 py-5 rounded-xl font-bold text-sm tracking-tight hover:bg-[#E8F3F9] hover:border-[#005F93] transition-all text-center active:scale-95"
            >
              {t('hero.cta_services')}
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
