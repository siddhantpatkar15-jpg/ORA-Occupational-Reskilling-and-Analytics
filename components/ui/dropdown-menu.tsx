'use client';

import * as React from 'react';

interface DropdownContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = React.createContext<DropdownContextType | undefined>(undefined);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild,
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const context = React.useContext(DropdownContext);

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      className: `${className} ${child.props.className || ''}`.trim(),
      onClick: (e: any) => {
        child.props.onClick?.(e);
        context?.setOpen((prev) => !prev);
      },
      ...props
    });
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => context?.setOpen((prev) => !prev)}
      {...props}
    >
      {children}
    </button>
  );
}


export function DropdownMenuContent({
  align = 'end',
  children,
  className = '',
}: {
  align?: 'start' | 'end';
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(DropdownContext);
  if (!context?.open) return null;

  return (
    <div
      className={`absolute ${
        align === 'end' ? 'right-0' : 'left-0'
      } mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-slate-100 focus:outline-none z-50 p-1 border border-slate-200 animate-in fade-in duration-100 ${className}`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  className = '',
  onClick,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(DropdownContext);
  return (
    <div
      className={`group flex items-center px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-md cursor-pointer transition-colors ${className}`}
      onClick={(e) => {
        onClick?.(e);
        context?.setOpen(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({
  children,
  className = '',
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider ${className}`}>
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return <div className="h-px bg-slate-100 my-1" />;
}
