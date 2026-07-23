import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSectionProps {
  title: string;
  subtitle?: string;
  items: FAQItem[];
  className?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  title,
  subtitle,
  items,
  className,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={cn('py-14 md:py-20 px-6', className)}>
      <div className="max-w-container-max mx-auto">
        <div className="mb-10 md:mb-14 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-on-surface uppercase tracking-tight mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted text-base md:text-lg font-medium leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.q}
                className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-start font-black text-on-surface hover:text-primary transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm md:text-base uppercase tracking-tight">{item.q}</span>
                  <ChevronDown
                    size={20}
                    className={cn('shrink-0 text-primary transition-transform', isOpen && 'rotate-180')}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-muted text-sm md:text-base font-medium leading-relaxed border-t border-outline-variant/60 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
