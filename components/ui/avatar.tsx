import * as React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Avatar({ src, alt = 'Avatar', initials, size = 'md', className = '', ...props }: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-slate-200 text-slate-600 font-medium ${sizes[size]} ${className}`} {...props}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span>{initials?.slice(0, 2).toUpperCase() || '?'}</span>
      )}
    </div>
  );
}
