import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'mark';
  theme?: 'light' | 'dark';
  href?: string;
}

export function Logo({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'light',
  href = '/',
}: LogoProps) {
  // Dimensions map
  const heights = {
    sm: 28,
    md: 38,
    lg: 48,
    xl: 64,
  };

  const markSizes = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56,
  };

  const h = heights[size];
  // Aspect ratio of the cropped logo is ~893/405 ≈ 2.2
  const w = Math.round(h * 2.2);

  const logoContent = (
    <div className={`inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 ${className}`}>
      {variant === 'mark' ? (
        <div
          className={`relative overflow-hidden rounded-lg flex items-center justify-center ${
            theme === 'dark' ? 'bg-[#3A4D5B]/30' : 'bg-transparent'
          }`}
          style={{ width: markSizes[size], height: markSizes[size] }}
        >
          <Image
            src="/icon-192.png"
            alt="ORA Logo Mark"
            width={markSizes[size]}
            height={markSizes[size]}
            className="object-contain"
            priority
          />
        </div>
      ) : (
        <div className="relative flex items-center">
          <Image
            src="/ora-logo-transparent.png"
            alt="ORA — Occupational Reskilling & Analytics"
            width={w}
            height={h}
            className={`object-contain ${theme === 'dark' ? 'brightness-0 invert drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]' : ''}`}
            priority
          />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
