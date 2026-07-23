import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../../hooks/useLocale';

export const Footer = () => {
  const { i18n } = useTranslation();
  const { lp } = useLocale();
  const isRtl = i18n.dir() === 'rtl';
  const currentYear = new Date().getFullYear();

  const navigation = [
    { to: lp('/'), en: 'Home', ar: 'الرئيسية' },
    { to: lp('/about'), en: 'About us', ar: 'من نحن' },
    { to: lp('/services'), en: 'Our services', ar: 'خدماتنا' },
    { to: lp('/contact'), en: 'Contact', ar: 'اتصل بنا' },
  ];

  const contactDetails = [
    {
      label: isRtl ? 'اتصل بنا' : 'Call us',
      value: '+962 79 700 6750',
      href: 'tel:+962797006750',
      icon: Phone,
      ltr: true,
    },
    {
      label: isRtl ? 'البريد الإلكتروني' : 'Email us',
      value: 'info@adfta.com',
      href: 'mailto:info@adfta.com',
      icon: Mail,
      ltr: true,
    },
    {
      label: isRtl ? 'موقع المكتب' : 'Visit our office',
      value: isRtl
        ? 'مجمع بيت العمر، الطابق الأول، خلدا، عمّان'
        : 'Beit Al Omor Complex, 1st Floor, Khalda, Amman',
      href: 'https://maps.google.com/?q=Beit+Al+Omor+Complex+Khalda+Amman+Jordan',
      icon: MapPin,
    },
  ];

  return (
    <footer className="adbs-footer-simple" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="relative z-[1] mx-auto max-w-[1320px]">
        <div className="mb-12 flex flex-col gap-6 border-b border-white/10 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.24em] text-[#70C1EA]">
              {isRtl ? 'استشارة مهنية تبدأ بالوضوح' : 'Professional advice starts with clarity'}
            </span>
            <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-[-0.03em] text-white md:text-4xl">
              {isRtl
                ? 'لنبنِ أساساً أدق لنمو أعمالك.'
                : 'Let’s build a more precise foundation for your business.'}
            </h2>
          </div>
          <Link
            to={lp('/contact')}
            className="group inline-flex w-fit items-center gap-3 rounded-full !bg-white px-6 py-3.5 text-sm font-black !text-[#0F2433] transition-all duration-300 hover:-translate-y-1 hover:!bg-[#DDF3FF] hover:shadow-[0_12px_30px_rgba(0,95,147,0.25)]"
          >
            {isRtl ? 'احجز استشارتك' : 'Book a consultation'}
            <ArrowUpRight
              size={17}
              className={`transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isRtl ? '-scale-x-100' : ''}`}
            />
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Link to={lp('/')} className="mb-6 inline-flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/[0.07] text-lg font-black tracking-tight text-white shadow-inner">
                ADBS
              </span>
              <span>
                <strong className="block text-xl font-black text-white">
                  {isRtl ? 'أساس الدقة' : 'Asas Al-Deqa'}
                </strong>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                  {isRtl ? 'استشارات ضريبية ومحاسبية' : 'Tax & Accounting Consultancy'}
                </span>
              </span>
            </Link>

            <p className="max-w-lg text-[15px] font-medium leading-7 text-white/65">
              {isRtl
                ? 'منذ عام 2014، نقدّم حلولاً محاسبية وضريبية واستشارات أعمال دقيقة تساعد الشركات في الأردن على الامتثال والنمو بثقة.'
                : 'Since 2014, we have delivered precise accounting, tax, and business advisory solutions that help companies across Jordan stay compliant and grow confidently.'}
            </p>

            <div className="mt-7 flex items-center gap-2.5">
              {[
                { href: 'https://www.facebook.com/people/Asas-aldiqqa/61582660085151/?locale=ar_AR', label: 'Facebook', icon: Facebook },
                { href: 'https://www.instagram.com/asasaldiqqa/', label: 'Instagram', icon: Instagram },
                { href: 'https://www.linkedin.com/company/asas-aldiqqa/', label: 'LinkedIn', icon: Linkedin },
                { href: 'https://wa.me/962797006750', label: 'WhatsApp', icon: MessageCircle },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/65 transition-all duration-300 hover:-translate-y-1 hover:border-[#70C1EA]/60 hover:bg-[#005F93] hover:text-white"
                >
                  <social.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-white/45">
              {isRtl ? 'روابط سريعة' : 'Explore'}
            </h3>
            <nav className="flex flex-col items-start gap-3.5" aria-label={isRtl ? 'روابط التذييل' : 'Footer navigation'}>
              {navigation.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group inline-flex items-center gap-2 text-sm font-bold text-white/70 transition-colors hover:text-white"
                >
                  <span className="h-px w-0 bg-[#70C1EA] transition-all duration-300 group-hover:w-4" />
                  {isRtl ? item.ar : item.en}
                </Link>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-5">
            <h3 className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-white/45">
              {isRtl ? 'معلومات التواصل' : 'Contact details'}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {contactDetails.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.icon === MapPin ? '_blank' : undefined}
                  rel={item.icon === MapPin ? 'noopener noreferrer' : undefined}
                  className={`group flex gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] ${item.icon === MapPin ? 'sm:col-span-2' : ''}`}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#005F93]/50 text-[#A7DCF7] transition-colors group-hover:bg-[#005F93] group-hover:text-white">
                    <item.icon size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-white/40">
                      {item.label}
                    </span>
                    <strong
                      dir={item.ltr ? 'ltr' : undefined}
                      className="block text-sm font-bold leading-6 text-white/85"
                    >
                      {item.value}
                    </strong>
                  </span>
                </a>
              ))}

              <div className="flex gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 sm:col-span-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#005F93]/50 text-[#A7DCF7]">
                  <Clock size={16} />
                </span>
                <span>
                  <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-white/40">
                    {isRtl ? 'ساعات العمل' : 'Office hours'}
                  </span>
                  <strong className="block text-sm font-bold leading-6 text-white/85">
                    {isRtl ? 'السبت – الخميس: 9:00 ص – 6:00 م · الجمعة: مغلق' : 'Sat – Thu: 9:00 AM – 6:00 PM · Friday: Closed'}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs font-semibold text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {isRtl
              ? `© ${currentYear} أساس الدقة. جميع الحقوق محفوظة.`
              : `© ${currentYear} Asas Al-Deqa. All rights reserved.`}
          </span>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#70C1EA]" />
            <span>{isRtl ? 'عمّان، المملكة الأردنية الهاشمية' : 'Amman, Hashemite Kingdom of Jordan'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
