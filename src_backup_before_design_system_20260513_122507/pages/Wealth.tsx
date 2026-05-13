import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { PieChart, ShieldCheck, TrendingUp, Landmark } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const Wealth = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-background min-h-screen text-on-surface pt-24">
      <SEO titleKey="seo.wealth_title" descriptionKey="seo.wealth_desc" />
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-container-max mx-auto text-center space-y-8"
        >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-on-surface uppercase leading-tight">
              حماية وتنمية
            </h1>
            <p className="text-muted text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
              نحن نصمم استراتيجيات مخصصة للحفاظ على الثروة عبر الأجيال، مع التركيز على الانضباط المالي والنمو المستدام.
            </p>
          </motion.div>
      </section>

      <section className="py-24 px-6 md:pb-40">
        <div className="max-w-container-max mx-auto grid md:grid-cols-3 gap-12 text-right">
          {[
            { icon: <TrendingUp size={24} />, title: 'تنمية الأصول', desc: 'استراتيجيات استثمارية مدروسة تهدف إلى تحقيق عوائد مستدامة في ظل تقلبات السوق.' },
            { icon: <ShieldCheck size={24} />, title: 'الحفاظ على الثروة', desc: 'أطر حماية صارمة تضمن استمرارية الثروة وانتقالها السلس للأجيال القادمة.' },
            { icon: <Landmark size={24} />, title: 'التخطيط الاستراتيجي', desc: 'هيكلة مالية وضريبية شاملة تتماشى مع الأهداف الشخصية والمؤسسية.' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-white border border-outline-variant rounded-3xl space-y-6 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-black text-on-surface uppercase tracking-tight mb-3">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
