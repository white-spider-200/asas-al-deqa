import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Building2, Users, Target, Shield } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const Institutional = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-background min-h-screen text-on-surface pt-24">
      <SEO titleKey="seo.institutional_title" descriptionKey="seo.institutional_desc" />
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-container-max mx-auto text-center space-y-8"
        >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-on-surface uppercase">
              تمكين المؤسسات
            </h1>
            <p className="text-muted text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
              نقدم استشارات متخصصة للشركات الكبرى والمؤسسات الحكومية لتطوير كفاءتها التشغيلية وامتثالها المالي.
            </p>
          </motion.div>
      </section>

      <section className="py-24 px-6 md:pb-40">
        <div className="max-w-container-max mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Building2 />, title: 'هيكلة الشركات', desc: 'إعادة تنظيم العمليات لرفع الكفاءة.' },
            { icon: <Users />, title: 'الحوكمة', desc: 'بناء أطر عمل رقابية متينة.' },
            { icon: <Target />, title: 'التحويل الاستراتيجي', desc: 'قيادة التغيير نحو التميز الرقمي والمالي.' },
            { icon: <Shield />, title: 'ادارة الامتثال', desc: 'ضمان التوافق مع الأنظمة المحلية والدولية.' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 border border-outline-variant bg-white flex flex-col gap-6 shadow-sm rounded-3xl hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                {item.icon}
              </div>
              <div>
                <h4 className="font-black text-xl text-on-surface mb-3 uppercase tracking-tight">{item.title}</h4>
                <p className="text-muted text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
