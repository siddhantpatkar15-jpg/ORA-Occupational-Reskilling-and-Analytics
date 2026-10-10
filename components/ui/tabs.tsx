'use client';

import * as React from 'react';

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | null>(null);

export function Tabs({ value, onValueChange, children, className = '' }: { 
  value: string; 
  onValueChange: (value: string) => void; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex space-x-1 border-b border-slate-200 ${className}`} role="tablist">
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = '' }: { value: string; children: React.ReactNode; className?: string }) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within a Tabs component');
  
  const isSelected = context.value === value;
  
  return (
    <button
      role="tab"
      aria-selected={isSelected}
      onClick={() => context.onValueChange(value)}
      className={`px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
        isSelected 
          ? 'text-teal-600 border-b-2 border-teal-600' 
          : 'text-slate-500 hover:text-slate-700 hover:border-b-2 hover:border-slate-300 border-b-2 border-transparent'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = '' }: { value: string; children: React.ReactNode; className?: string }) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within a Tabs component');
  
  if (context.value !== value) return null;
  
  return (
    <div role="tabpanel" className={`pt-4 focus:outline-none ${className}`} tabIndex={0}>
      {children}
    </div>
  );
}
