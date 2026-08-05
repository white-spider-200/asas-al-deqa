import React from 'react';
import { cn } from '../../../lib/utils';

type ToolbarButtonProps = {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
};

export function ToolbarButton({
  onClick,
  title,
  children,
  active,
  disabled,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        active ? 'bg-primary text-white' : 'text-on-surface hover:bg-surface-container',
      )}
    >
      {children}
    </button>
  );
}

/** Vertical rule separating toolbar clusters. */
export function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px shrink-0 bg-outline-variant" aria-hidden />;
}
