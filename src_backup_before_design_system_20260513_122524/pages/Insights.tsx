import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Newspaper, BarChart2, Globe } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const Insights = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-background min-h-screen text-on-surface pt-24 font-sans selection:bg-primary selection:text-white">
      <SEO titleKey="seo.insights_title" descriptionKey="seo.insights_desc" />
      <section className="py-24 px-6 relative overflow-hidden text-center bg-white border-b border-outline-variant">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        </div>
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-on-surface uppercase">
            بوصلتك في عالم الاستشارات
          </h1>
        </motion.div>
      </section>

      <section className="py-24 px-6 md:pb-40">
        <div className="max-w-container-max mx-auto grid md:grid-cols-2 gap-16 text-right">
          {[
            { tag: 'تقرير ربع سنوي', title: 'مستقبل السوق العقاري في الرياض 2024', desc: 'تحليل شامل للفرص والتحديات في ظل التوسعات الاقتصادية الكبرى.' },
            { tag: 'مقالة', title: 'دليل الامتثال الضريبي للشركات الناشئة', desc: 'كيف تبدأ مشروعك بأسس مالية قانونية صحيحة تضمن الاستمرارية.' },
            { tag: 'رؤية', title: 'أثر الذكاء الاصطناعي على المحاسبة الاستشارية', desc: 'كيف نعيد تعريف الكفاءة والسرعة باستخدام التقنيات المتطورة.' },
            { tag: 'تحليل', title: 'خارطة طريق الاستثمار في القطاع الخدمي', desc: 'استكشاف القطاعات الأكثر نمواً في سوق الأعمال الحالي.' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer border-b border-outline-variant pb-12 hover:border-primary transition-all"
            >
              <h3 className="text-2xl md:text-3xl font-black mb-4 text-on-surface group-hover:text-primary transition-colors uppercase leading-tight">{item.title}</h3>
              <p className="text-muted text-base md:text-lg font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
