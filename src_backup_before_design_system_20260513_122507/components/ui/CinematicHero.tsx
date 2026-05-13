import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export const CinematicHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !headlineRef.current || !bgRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance Animation
      const tl = gsap.timeline();
      
      tl.fromTo(bgRef.current, 
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.5, ease: 'power2.out' }
      )
      .fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5 },
        '-=1'
      )
      .fromTo(headlineRef.current?.querySelectorAll('.char'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 1, ease: 'back.out(1.7)' },
        '-=1'
      )
      .fromTo('.hero-sub',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.5'
      )
      .fromTo('.hero-cta',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' },
        '-=0.3'
      );

      // Scroll Parallax
      gsap.to(bgRef.current, {
        y: '20%',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to(headlineRef.current, {
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '30% top',
          scrub: true
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const text = "أساس الدقة للإستشارات المالية";
  const words = text.split(' ');

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden bg-background flex items-center justify-center pt-20"
      dir="rtl"
    >
      {/* Background Image with Overlay */}
      <div 
        ref={bgRef}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
          alt="Amman Cityscape Architecture" 
          className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div 
          ref={overlayRef}
          className="absolute inset-0 bg-linear-to-b from-background/90 via-background/40 to-background"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-1 pointer-events-none opacity-10" 
           style={{ backgroundImage: 'radial-gradient(var(--color-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="relative z-10 max-w-container-max mx-auto px-6 text-center">
        <h1 
          ref={headlineRef}
          className="text-display-lg mb-8 leading-tight tracking-tight text-on-surface flex flex-wrap justify-center gap-x-4"
        >
          {words.map((word, index) => (
            <span key={index} className="char inline-block">
              {word}
            </span>
          ))}
        </h1>

        <p className="hero-sub text-headline-xl text-on-surface-variant max-w-3xl mx-auto mb-12 opacity-0 font-light leading-relaxed">
          نحن نبني المستقبل المالي لشركائنا من خلال حلول استراتيجية قائمة على الدقة والنزاهة والخبرة العلمية المتطورة.
        </p>

        <div className="hero-cta flex flex-wrap justify-center gap-6 opacity-0">
          <Link 
            to="/services" 
            className="group relative px-10 py-4 bg-primary text-on-primary font-bold overflow-hidden transition-all hover:pr-14"
          >
            <span className="relative z-10">استكشف خدماتنا</span>
            <div className="absolute inset-0 bg-primary-container -translate-x-full transition-transform duration-300 group-hover:translate-x-0" />
            <ArrowLeft className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" size={20} />
          </Link>
          
          <Link 
            to="/about" 
            className="px-10 py-4 border border-outline/30 text-on-surface font-bold hover:bg-surface transition-all"
          >
            عن الشركة
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-primary/50 cursor-pointer flex flex-col items-center gap-2"
        onClick={() => {
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold">مرر للأسفل</span>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
};
