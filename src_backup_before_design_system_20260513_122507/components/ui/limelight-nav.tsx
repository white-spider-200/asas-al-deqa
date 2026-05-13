import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

// --- Internal Types ---

export type NavItem = {
  id: string | number;
  icon?: React.ReactElement;
  label: string;
  path?: string;
  onClick?: () => void;
};

type LimelightNavProps = {
  items: NavItem[];
  defaultActiveIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  itemContainerClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
};

/**
 * An adaptive-width navigation bar with a "limelight" effect that highlights the active item.
 */
export const LimelightNav = ({
  items,
  defaultActiveIndex = 0,
  onTabChange,
  className = "",
  limelightClassName = "",
  itemContainerClassName = "",
  activeClassName = "text-primary opacity-100",
  inactiveClassName = "text-foreground opacity-40",
}: LimelightNavProps) => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(() => {
    const foundIndex = items.findIndex(item => item.path === location.pathname);
    return foundIndex !== -1 ? foundIndex : defaultActiveIndex;
  });
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);
  const itemContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  // Sync with location changes
  useEffect(() => {
    const foundIndex = items.findIndex(item => item.path === location.pathname);
    if (foundIndex !== -1 && foundIndex !== activeIndex) {
      setActiveIndex(foundIndex);
    }
  }, [location.pathname, items, activeIndex]);

  useLayoutEffect(() => {
    if (items.length === 0) return;

    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];
    const activeContent = itemContentRefs.current[activeIndex];
    
    if (limelight && activeItem && activeContent) {
      // Add a small amount of padding to ensure it covers the word perfectly
      const padding = 20; 
      const width = activeContent.offsetWidth + padding;
      const left = activeItem.offsetLeft + (activeItem.offsetWidth - width) / 2;
      
      limelight.style.left = `${left}px`;
      limelight.style.width = `${width}px`;

      if (!isReady) {
        const timeout = setTimeout(() => setIsReady(true), 50);
        return () => clearTimeout(timeout);
      }
    }
  }, [activeIndex, isReady, items]);

  if (items.length === 0) {
    return null; 
  }

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    setActiveIndex(index);
    onTabChange?.(index);
    itemOnClick?.();
  };

  return (
    <nav className={cn("relative inline-flex items-center rounded-lg bg-card/50 backdrop-blur-sm border px-2", className)} id="limelight-nav">
      {items.map(({ id, icon, label, path, onClick }, index) => {
        const isActive = activeIndex === index;
        const Component = path ? Link : 'a';
        const props = path ? { to: path } : { onClick: () => handleItemClick(index, onClick) };

        return (
          <Component
            key={id}
            {...(props as any)}
            ref={el => (navItemRefs.current[index] = el)}
            className={cn(
              "relative z-20 flex h-full cursor-pointer items-center justify-center px-4 py-3 transition-colors duration-300",
              itemContainerClassName
            )}
            onClick={path ? () => handleItemClick(index, onClick) : undefined}
            aria-label={label}
            id={`nav-item-${id}`}
          >
            <div 
              ref={el => (itemContentRefs.current[index] = el)}
              className={cn(
                "flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all duration-300",
                isActive ? activeClassName : inactiveClassName
              )}
            >
              {icon && React.cloneElement(icon as React.ReactElement, {
                className: cn("w-4 h-4", (icon as React.ReactElement).props.className)
              })}
              <span>{label}</span>
            </div>
          </Component>
        );
      })}

      <div 
        ref={limelightRef}
        className={cn(
          "absolute top-0 z-10 h-[2px] rounded-full bg-primary shadow-[0_20px_10px_theme(colors.primary)]",
          isReady ? 'transition-[left,width] duration-400 ease-in-out' : '',
          limelightClassName
        )}
        style={{ left: '-999px', width: '44px' }}
        id="limelight-indicator"
      >
        <div className="absolute left-[-15%] top-[2px] w-[130%] h-10 [clip-path:polygon(5%_100%,25%_0,75%_0,95%_100%)] bg-gradient-to-b from-primary/40 to-transparent pointer-events-none" />
      </div>
    </nav>
  );
};
