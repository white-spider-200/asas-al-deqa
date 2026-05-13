import React, { useEffect, useRef, ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  customSize?: boolean; // When true, ignores size prop and uses width/height or className
}

const glowColorMap = {
  blue: { base: 200, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
  gold: { base: 45, spread: 150 },
  gray: { base: 210, spread: 0 }
};

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96'
};

const GlowCard: React.FC<GlowCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      
      if (cardRef.current) {
        // Calculate relative position for the card
        const bounds = cardRef.current.getBoundingClientRect();
        const rx = x - bounds.left;
        const ry = y - bounds.top;

        cardRef.current.style.setProperty('--x', rx.toFixed(2));
        cardRef.current.style.setProperty('--xp', (rx / bounds.width).toFixed(2));
        cardRef.current.style.setProperty('--y', ry.toFixed(2));
        cardRef.current.style.setProperty('--yp', (ry / bounds.height).toFixed(2));

        // Global position for attachment: fixed patterns
        cardRef.current.style.setProperty('--gx', x.toFixed(2));
        cardRef.current.style.setProperty('--gy', y.toFixed(2));
      }
    };

    window.addEventListener('pointermove', syncPointer);
    return () => window.removeEventListener('pointermove', syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor] || glowColorMap.gold;

  // Determine sizing
  const getSizeClasses = () => {
    if (customSize) {
      return ''; // Let className or inline styles handle sizing
    }
    return sizeMap[size];
  };

  const getInlineStyles = () => {
    const baseStyles: any = {
      '--base': base,
      '--spread': spread,
      '--radius': '24',
      '--border': '1',
      '--backdrop': 'rgba(255, 255, 255, 1)',
      '--backup-border': 'rgba(0, 0, 0, 0.05)',
      '--size': '500',
      '--outer': '0.3',
      '--saturation': '80',
      '--lightness': '40',
      '--border-size': 'calc(var(--border, 2) * 1px)',
      '--spotlight-size': 'calc(var(--size, 150) * 1px)',
      '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      backgroundColor: 'var(--backdrop, white)',
      border: 'var(--border-size) solid var(--backup-border)',
      position: 'relative' as const,
      touchAction: 'none' as const,
    };

    // Add width and height if provided
    if (width !== undefined) {
      baseStyles.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === 'number' ? `${height}px` : height;
    }

    return baseStyles;
  };

  const beforeAfterStyles = `
    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-attachment: fixed;
      background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
      -webkit-mask-composite: destination-in;
    }
    
    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.8) calc(var(--spotlight-size) * 0.8) at
        calc(var(--gx, 0) * 1px)
        calc(var(--gy, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 60) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
      );
      filter: brightness(2);
    }
    
    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.4) calc(var(--spotlight-size) * 0.4) at
        calc(var(--gx, 0) * 1px)
        calc(var(--gy, 0) * 1px),
        hsl(0 100% 100% / var(--border-light-opacity, 0.8)), transparent 100%
      );
    }
    
    [data-glow] [data-glow] {
      position: absolute;
      inset: -5px;
      will-change: filter;
      opacity: var(--outer, 1);
      border-radius: calc(var(--radius) * 1px);
      filter: blur(25px);
      background: none;
      pointer-events: none;
      border: none;
      z-index: -1;
    }
    
    [data-glow] [data-glow]::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.9) calc(var(--spotlight-size) * 0.9) at
        calc(var(--gx, 0) * 1px)
        calc(var(--gy, 0) * 1px),
        hsl(var(--hue, 200) 100% 60% / 0.5), transparent 100%
      );
      background-attachment: fixed;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <div
        ref={cardRef}
        data-glow
        style={getInlineStyles()}
        className={`
          ${getSizeClasses()}
          ${!customSize ? 'aspect-[3/4]' : ''}
          rounded-2xl 
          relative 
          flex flex-col
          shadow-[0_2rem_4rem_-2rem_rgba(0,95,147,0.15)] 
          p-8 
          gap-4 
          transition-all duration-500
          hover:shadow-[0_3rem_6rem_-3rem_rgba(0,95,147,0.25)]
          hover:-translate-y-1
          ${className}
        `}
      >
        <div ref={innerRef} data-glow></div>
        {children}
      </div>
    </>
  );
};

export { GlowCard };
