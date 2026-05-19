import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <footer className="adbs-footer-simple" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="adbs-footer-simple-container">
        <div className="adbs-footer-simple-brand">
          <h3>{isRtl ? 'أساس الدقة / ADBS' : 'ADBS / Asas Al Diqqa'}</h3>
          <p>
            {isRtl
              ? 'هندسة مالية واستشارات استراتيجية مخصصة تساعد الشركات على النمو بثقة ووضوح.'
              : 'Tailored financial engineering and strategic advisory services that help businesses grow with confidence and clarity.'}
          </p>

          <div className="adbs-footer-simple-phone">
            <Phone size={18} />
            <div>
              <span>{isRtl ? 'رقم الهاتف' : 'Phone Number'}</span>
              <strong>+962797006750</strong>
            </div>
          </div>
        </div>

        <div className="adbs-footer-simple-side">
          <nav className="adbs-footer-simple-links" aria-label="Footer links">
            <Link to="/">{isRtl ? 'الرئيسية' : 'Home'}</Link>
            <Link to="/services">{isRtl ? 'الخدمات' : 'Services'}</Link>
            <Link to="/about">{isRtl ? 'من نحن' : 'About'}</Link>
            <Link to="/contact">{isRtl ? 'اتصل بنا' : 'Contact'}</Link>
          </nav>

          <div className="adbs-footer-simple-social">
            <a href="https://www.facebook.com/p/%D8%A7%D8%B3%D8%A7%D8%B3-%D8%A7%D9%84%D8%AF%D9%82%D8%A9-Asas-Aldeqa-100063451226282/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={22} />
            </a>
            <a href="https://www.instagram.com/asas_tax/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={22} />
            </a>
            <a href="https://www.linkedin.com/in/ibrahim-altous-806061383/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={22} />
            </a>
            <a href="https://wa.me/962797006750" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <MessageCircle size={22} />
            </a>
            <a href="mailto:info@adfta.com" aria-label="Email">
              <Mail size={22} />
            </a>
          </div>
        </div>
      </div>

      <div className="adbs-footer-simple-bottom">
        {isRtl ? '© 2026 أساس الدقة. جميع الحقوق محفوظة.' : '© 2026 ADBS. All rights reserved.'}
      </div>
    </footer>
  );
};
