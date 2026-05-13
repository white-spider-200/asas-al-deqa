import React from "react";
import { cn } from "../../lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      dir="ltr"
      aria-label="ADBS Asas Al Diqqa Logo"
    >
      <img
        src="/adbs-logo-cropped.jpg"
        alt="ADBS Logo"
        className="h-10 md:h-12 w-auto object-contain block mix-blend-multiply"
      />
    </div>
  );
};
